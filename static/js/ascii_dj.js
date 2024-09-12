class AsciiDJ {
    constructor(element) {
        this.element = element;
        this.frames = [
            `
   _____
  /     \\
 |  o o  |
 |   ^   |
 |  \\-/  |
  \\_____/
    | |
  __| |__
 |       |
 |_______|
    `,
            `
   _____
  /     \\
 | o   o |
 |   ^   |
 |  ---  |
  \\_____/
    | |
 ___| |___
|         |
|_________|
    `
        ];
        this.currentFrame = 0;
        this.interval = null;
        console.log('AsciiDJ instance created'); // Debug log
    }

    start() {
        console.log('AsciiDJ start method called'); // Debug log
        this.interval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.element.innerHTML = `<pre>${this.frames[this.currentFrame]}</pre>`;
            console.log('AsciiDJ frame updated'); // Debug log
        }, 500);
    }

    stop() {
        console.log('AsciiDJ stop method called'); // Debug log
        clearInterval(this.interval);
        this.interval = null;
    }
}
