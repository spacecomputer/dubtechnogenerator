class DubTechnoGenerator {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.scheduledNotes = [];
        this.useWebGL = this.checkWebGLSupport();
        this.bpm = 120;
    }

    checkWebGLSupport() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl instanceof WebGLRenderingContext;
    }

    async initialize() {
        // Initialize audio context on user interaction
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.setupEffectChain();

        if (this.useWebGL) {
            try {
                this.model = await tf.loadLayersModel('/static/models/dub_techno_model.json');
                console.log('TensorFlow.js model loaded successfully');
            } catch (error) {
                console.error('Failed to load TensorFlow.js model:', error);
                this.useWebGL = false;
            }
        }
        console.log('Dub Techno Generator initialized');
    }

    setupEffectChain() {
        // Create main bus
        this.mainBus = this.audioContext.createGain();
        this.mainBus.gain.setValueAtTime(0.8, this.audioContext.currentTime);

        // Create compressor for glue
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
        this.compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);

        // Create delay
        this.delay = this.audioContext.createDelay(5.0);
        this.delay.delayTime.setValueAtTime(0.5, this.audioContext.currentTime);

        // Create filter for sweeps
        this.filter = this.audioContext.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);

        // Connect the effect chain
        this.mainBus.connect(this.compressor);
        this.compressor.connect(this.delay);
        this.delay.connect(this.filter);
        this.filter.connect(this.audioContext.destination);

        console.log('Effect chain set up');
    }

    startAudio() {
        if (this.isPlaying) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('AudioContext resumed');
                this.startPlayback();
            });
        } else {
            this.startPlayback();
        }
    }

    startPlayback() {
        this.isPlaying = true;
        console.log('Starting audio playback');
        this.generateMusic();
    }

    stopAudio() {
        console.log('Stopping audio');
        this.isPlaying = false;
        this.scheduledNotes.forEach(note => {
            if (note.stop) {
                note.stop();
            }
        });
        this.scheduledNotes = [];
    }

    generateMusic() {
        if (!this.isPlaying) return;

        const now = this.audioContext.currentTime;
        const beatDuration = 60 / this.bpm;
        const patternLength = 16;

        this.generateKickDrum(now, beatDuration, patternLength);
        this.generateHiHat(now, beatDuration, patternLength);
        this.generateChordStab(now, beatDuration, patternLength);
        this.generateBassline(now, beatDuration, patternLength);
        this.applyDubEffects(now, beatDuration * patternLength);

        console.log('Generated music pattern');

        setTimeout(() => this.generateMusic(), patternLength * beatDuration * 1000);
    }

    // ... (keep the rest of the methods as they were in the previous version)

    scheduleKick(time, duration) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(60, time);
        oscillator.frequency.exponentialRampToValueAtTime(30, time + 0.03);

        gainNode.gain.setValueAtTime(1, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.mainBus);

        oscillator.start(time);
        oscillator.stop(time + duration);

        this.scheduledNotes.push(oscillator);
        console.log('Scheduled kick drum');
    }

    // ... (keep the other scheduling methods, adding console.log statements as above)
}

const dubTechnoGenerator = new DubTechnoGenerator();

// Initialize the generator
dubTechnoGenerator.initialize().then(() => {
    console.log('Dub Techno Generator initialized and ready');

    // Add event listeners to start and stop buttons
    document.getElementById('startButton').addEventListener('click', () => {
        dubTechnoGenerator.startAudio();
    });

    document.getElementById('stopButton').addEventListener('click', () => {
        dubTechnoGenerator.stopAudio();
    });
});

