class DubTechnoGenerator {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false;
        this.scheduledNotes = [];
        this.useWebGL = this.checkWebGLSupport();
    }

    checkWebGLSupport() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl instanceof WebGLRenderingContext;
    }

    async initialize() {
        if (this.useWebGL) {
            try {
                this.model = await tf.loadLayersModel('/static/models/dub_techno_model.json');
            } catch (error) {
                console.error('Failed to load TensorFlow.js model:', error);
                this.useWebGL = false;
            }
        }
    }

    startAudio() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.generateMusic();
    }

    stopAudio() {
        this.isPlaying = false;
        this.scheduledNotes.forEach(note => note.stop());
        this.scheduledNotes = [];
    }

    generateMusic() {
        if (!this.isPlaying) return;

        const now = this.audioContext.currentTime;
        const noteDuration = 0.5;
        const patternLength = 16;

        for (let i = 0; i < patternLength; i++) {
            const noteTime = now + i * noteDuration;
            this.scheduleNote(noteTime, noteDuration);
        }

        setTimeout(() => this.generateMusic(), patternLength * noteDuration * 1000);
    }

    scheduleNote(time, duration) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(this.getRandomFrequency(), time);

        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.5, time + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(time);
        oscillator.stop(time + duration);

        this.scheduledNotes.push(oscillator);
    }

    getRandomFrequency() {
        const frequencies = [55, 110, 146.83, 220, 293.66];
        return frequencies[Math.floor(Math.random() * frequencies.length)];
    }
}

window.dubTechnoGenerator = new DubTechnoGenerator();
