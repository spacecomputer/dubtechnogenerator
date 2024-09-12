console.log('audio.js loaded');

export class DubTechnoGenerator {
    constructor() {
        console.log('DubTechnoGenerator constructor called');
        this.audioContext = null;
        this.isPlaying = false;
        this.scheduledNotes = [];
        this.useWebGL = this.checkWebGLSupport();
        this.bpm = 120;
        this.loopInterval = null;
    }

    checkWebGLSupport() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl instanceof WebGLRenderingContext;
    }

    async initialize() {
        console.log('Initializing DubTechnoGenerator');
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('AudioContext created successfully');
            console.log('AudioContext state after creation:', this.audioContext.state);

            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
                console.log('AudioContext resumed from suspended state');
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
            console.log('Dub Techno Generator initialized successfully');
        } catch (error) {
            console.error('Error during DubTechnoGenerator initialization:', error);
        }
    }

    setupEffectChain() {
        // Implement effect chain setup here
        console.log('Effect chain setup not implemented yet');
    }

    startAudio() {
        console.log('startAudio method called, isPlaying:', this.isPlaying);
        if (this.isPlaying) {
            console.log('Audio is already playing, returning');
            return;
        }
        if (this.audioContext.state === 'suspended') {
            console.log('AudioContext is suspended, attempting to resume');
            this.audioContext.resume().then(() => {
                console.log('AudioContext resumed successfully');
                this.startPlayback();
            }).catch(error => {
                console.error('Failed to resume AudioContext:', error);
            });
        } else {
            console.log('AudioContext is not suspended, starting playback');
            this.startPlayback();
        }
    }

    startPlayback() {
        this.isPlaying = true;
        console.log('Starting audio playback, isPlaying:', this.isPlaying);
        this.generateMusic();
        this.loopInterval = setInterval(() => this.generateMusic(), 60000 / this.bpm * 4); // Generate new music every 4 beats
    }

    stopAudio() {
        console.log('stopAudio method called, isPlaying:', this.isPlaying);
        this.isPlaying = false;
        clearInterval(this.loopInterval);
        this.scheduledNotes.forEach(note => {
            if (note.stop) {
                note.stop();
            }
        });
        this.scheduledNotes = [];
        console.log('Audio stopped, scheduled notes cleared, isPlaying:', this.isPlaying);
    }

    generateMusic() {
        if (!this.isPlaying) {
            console.log('generateMusic called but isPlaying is false, returning');
            return;
        }

        console.log('Generating music...');
        // Implement music generation logic here
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4 note
        oscillator.connect(this.audioContext.destination);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1); // Short beep
        this.scheduledNotes.push(oscillator);
        console.log('Generated a beep');
    }
}
yes