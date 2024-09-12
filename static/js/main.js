document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded');
    const playButton = document.getElementById('playButton');
    const asciiDjElement = document.getElementById('ascii-dj');
    const loadingOverlay = document.getElementById('loading-overlay');
    console.log('ASCII DJ element:', asciiDjElement);

    if (!asciiDjElement) {
        console.error('ASCII DJ element not found!');
        return;
    }

    const asciiDj = new AsciiDJ(asciiDjElement);

    try {
        await dubTechnoGenerator.initialize();
        console.log('Dub Techno Generator initialized successfully');
        loadingOverlay.style.display = 'none';
        playButton.disabled = false;
    } catch (error) {
        console.error('Failed to initialize Dub Techno Generator:', error);
        loadingOverlay.innerHTML = '<p>Failed to initialize Dub Techno Generator. Please refresh the page and try again.</p>';
        return;
    }

    playButton.addEventListener('click', () => {
        console.log('Play button clicked');
        if (dubTechnoGenerator.isPlaying) {
            console.log('Stopping audio and ASCII DJ');
            dubTechnoGenerator.stopAudio();
            asciiDj.stop();
            playButton.textContent = '▶ Play';
        } else {
            console.log('Starting audio and ASCII DJ');
            // Resume the AudioContext after user interaction
            dubTechnoGenerator.audioContext.resume().then(() => {
                dubTechnoGenerator.startAudio();
                asciiDj.start();
                playButton.textContent = '⏹ Stop';
            });
        }
    });
});
