document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded');
    const playButton = document.getElementById('playButton');
    const asciiDjElement = document.getElementById('ascii-dj');
    console.log('ASCII DJ element:', asciiDjElement);

    if (!asciiDjElement) {
        console.error('ASCII DJ element not found!');
        return;
    }

    const asciiDj = new AsciiDJ(asciiDjElement);

    // Initialize the global DubTechnoGenerator instance
    await window.dubTechnoGenerator.initialize();

    playButton.addEventListener('click', () => {
        console.log('Play button clicked');
        if (window.dubTechnoGenerator.isPlaying) {
            console.log('Stopping audio and ASCII DJ');
            window.dubTechnoGenerator.stopAudio();
            asciiDj.stop();
            playButton.textContent = '▶ Play';
        } else {
            console.log('Starting audio and ASCII DJ');
            // Resume the AudioContext after user interaction
            window.dubTechnoGenerator.audioContext.resume().then(() => {
                window.dubTechnoGenerator.startAudio();
                asciiDj.start();
                playButton.textContent = '⏹ Stop';
            });
        }
    });
});
