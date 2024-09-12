console.log('ascii_dj.js loaded');

export class AsciiDJ {
    constructor(element) {
        console.log('AsciiDJ constructor called');
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
        console.log('AsciiDJ instance created');
    }

    start() {
        console.log('AsciiDJ start method called');
        this.interval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.element.innerHTML = `<pre>${this.frames[this.currentFrame]}</pre>`;
            console.log('AsciiDJ frame updated');
        }, 500);
    }

    stop() {
        console.log('AsciiDJ stop method called');
        clearInterval(this.interval);
        this.interval = null;
    }
}
