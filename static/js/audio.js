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
        this.effectChain = null;
        this.bassPattern = [1, 0, 0, 0, 1, 0, 0, 0];
        this.chordPattern = [1, 0, 1, 0, 1, 0, 1, 0];
        this.currentStep = 0;
        this.masterGainNode = null;
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

            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.connect(this.audioContext.destination);

            await this.resumeAudioContext();
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
            throw error;
        }
    }

    async resumeAudioContext() {
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('AudioContext resumed successfully');
            } catch (error) {
                console.error('Failed to resume AudioContext:', error);
                throw error;
            }
        }
    }

    setupEffectChain() {
        const compressor = this.audioContext.createDynamicsCompressor();
        const filter = this.audioContext.createBiquadFilter();
        const delay = this.audioContext.createDelay();
        const feedback = this.audioContext.createGain();

        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        filter.Q.value = 5;

        delay.delayTime.value = 0.5;
        feedback.gain.value = 0.4;

        delay.connect(feedback);
        feedback.connect(delay);

        this.effectChain = [compressor, filter, delay];
        this.effectChain.reduce((prev, curr) => prev.connect(curr));
        this.effectChain[this.effectChain.length - 1].connect(this.masterGainNode);

        console.log('Effect chain set up successfully');
    }

    async startAudio() {
        console.log('startAudio method called, isPlaying:', this.isPlaying);
        if (this.isPlaying) {
            console.log('Audio is already playing, returning');
            return;
        }
        try {
            await this.resumeAudioContext();
            this.startPlayback();
        } catch (error) {
            console.error('Failed to start audio:', error);
        }
    }

    startPlayback() {
        this.isPlaying = true;
        console.log('Starting audio playback, isPlaying:', this.isPlaying);
        
        this.playTestTone();
        
        this.currentStep = 0;
        this.generateMusic();
        this.loopInterval = setInterval(() => this.generateMusic(), 60000 / this.bpm / 2);
    }

    playTestTone() {
        console.log('Playing test tone');
        const oscillator = this.createOscillator('sine', 440);
        const gainNode = this.audioContext.createGain();
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 1);
        
        console.log('Test tone scheduled');
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
        
        const currentTime = this.audioContext.currentTime;
        console.log('Current audio context time:', currentTime);
        
        this.generateBass(currentTime);
        this.generateChord(currentTime);
        this.generateHiHat(currentTime);

        this.currentStep = (this.currentStep + 1) % 8;
        console.log('Generated music for step', this.currentStep);
    }

    generateBass(currentTime) {
        if (this.bassPattern[this.currentStep]) {
            console.log('Generating bass for step', this.currentStep);
            const bassOsc = this.createOscillator('sine', 55);
            const bassEnvelope = this.createEnvelope(0.5, 0.01, 0.5);
            
            bassOsc.connect(bassEnvelope);
            bassEnvelope.connect(this.effectChain[0]);
            
            bassOsc.start(currentTime);
            bassOsc.stop(currentTime + 0.5);
            
            this.scheduledNotes.push(bassOsc);
            console.log('Bass note scheduled');
        }
    }

    generateChord(currentTime) {
        if (this.chordPattern[this.currentStep]) {
            console.log('Generating chord for step', this.currentStep);
            const chordFreqs = [220, 277.18, 329.63]; // A3, C#4, E4
            chordFreqs.forEach(freq => {
                const chordOsc = this.createOscillator('sine', freq);
                const chordEnvelope = this.createEnvelope(0.2, 0.05, 1);
                
                chordOsc.connect(chordEnvelope);
                chordEnvelope.connect(this.effectChain[0]);
                
                chordOsc.start(currentTime);
                chordOsc.stop(currentTime + 1);
                
                this.scheduledNotes.push(chordOsc);
            });
            console.log('Chord notes scheduled');
        }
    }

    generateHiHat(currentTime) {
        if (this.currentStep % 2 === 0) {
            console.log('Generating hi-hat for step', this.currentStep);
            const hihatOsc = this.createOscillator('square', 8000);
            const hihatEnvelope = this.createEnvelope(0.2, 0.01, 0.1);
            
            const hihatFilter = this.audioContext.createBiquadFilter();
            hihatFilter.type = 'highpass';
            hihatFilter.frequency.setValueAtTime(7000, currentTime);
            
            hihatOsc.connect(hihatEnvelope);
            hihatEnvelope.connect(hihatFilter);
            hihatFilter.connect(this.effectChain[0]);
            
            hihatOsc.start(currentTime);
            hihatOsc.stop(currentTime + 0.1);
            
            this.scheduledNotes.push(hihatOsc);
            console.log('Hi-hat note scheduled');
        }
    }

    createOscillator(type, frequency) {
        const osc = this.audioContext.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        return osc;
    }

    createEnvelope(peakGain, attackTime, decayTime) {
        const envelope = this.audioContext.createGain();
        const currentTime = this.audioContext.currentTime;
        envelope.gain.setValueAtTime(0, currentTime);
        envelope.gain.linearRampToValueAtTime(peakGain, currentTime + attackTime);
        envelope.gain.exponentialRampToValueAtTime(0.01, currentTime + attackTime + decayTime);
        return envelope;
    }

    setTempo(bpm) {
        this.bpm = bpm;
        if (this.isPlaying) {
            clearInterval(this.loopInterval);
            this.loopInterval = setInterval(() => this.generateMusic(), 60000 / this.bpm / 2);
        }
        console.log('Tempo set to', bpm, 'BPM');
    }

    setFilterFrequency(frequency) {
        if (this.effectChain && this.effectChain[1] instanceof BiquadFilterNode) {
            this.effectChain[1].frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            console.log('Filter frequency set to', frequency, 'Hz');
        }
    }

    setDelayTime(delayTime) {
        if (this.effectChain && this.effectChain[2] instanceof DelayNode) {
            this.effectChain[2].delayTime.setValueAtTime(delayTime, this.audioContext.currentTime);
            console.log('Delay time set to', delayTime, 'seconds');
        }
    }

    setMasterVolume(volume) {
        if (this.masterGainNode) {
            this.masterGainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            console.log('Master volume set to', volume);
        }
    }
}
