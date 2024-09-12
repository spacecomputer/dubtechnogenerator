console.log('main.js loaded');

import { DubTechnoGenerator } from './audio.js';
import { AsciiDJ } from './ascii_dj.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded');
    console.log('TensorFlow.js available:', typeof tf !== 'undefined');

    const playButton = document.getElementById('playButton');
    const asciiDjElement = document.getElementById('ascii-dj');
    console.log('ASCII DJ element:', asciiDjElement);

    if (!asciiDjElement) {
        console.error('ASCII DJ element not found!');
        return;
    }

    console.log('Attempting to create AsciiDJ instance');
    const asciiDj = new AsciiDJ(asciiDjElement);
    console.log('AsciiDJ instance created');

    console.log('Attempting to create DubTechnoGenerator instance');
    const dubTechnoGenerator = new DubTechnoGenerator();
    console.log('DubTechnoGenerator instance created');
    console.log('DubTechnoGenerator initial isPlaying state:', dubTechnoGenerator.isPlaying);

    try {
        console.log('Initializing DubTechnoGenerator');
        await dubTechnoGenerator.initialize();
        console.log('Dub Techno Generator initialized successfully');
    } catch (error) {
        console.error('Error initializing Dub Techno Generator:', error);
    }

    playButton.addEventListener('click', () => {
        console.log('Play button clicked');
        console.log('isPlaying state before action:', dubTechnoGenerator.isPlaying);
        if (dubTechnoGenerator.isPlaying) {
            console.log('Attempting to stop audio and ASCII DJ');
            dubTechnoGenerator.stopAudio();
            asciiDj.stop();
            playButton.textContent = '▶ Play';
            console.log('Audio stopped, ASCII DJ stopped, button text updated to Play');
        } else {
            console.log('Attempting to start audio and ASCII DJ');
            dubTechnoGenerator.startAudio();
            asciiDj.start();
            playButton.textContent = '⏹ Stop';
            console.log('Audio started, ASCII DJ started, button text updated to Stop');
        }
        console.log('isPlaying state after action:', dubTechnoGenerator.isPlaying);
    });

    if (window.AudioContext || window.webkitAudioContext) {
        console.log('Web Audio API is supported');
    } else {
        console.error('Web Audio API is not supported in this browser');
    }
});
