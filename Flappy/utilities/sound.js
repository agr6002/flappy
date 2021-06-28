export class SoundEffect {
  constructor(src, callback) {
    console.log("    CONSTRUCTING SoundEffect() using src=\"" + src +
      "\", with" + (callback ? "" : "out") + " callback.");
    const that = this;
    this.audio = new Audio(src);
    this.audio.addEventListener("canplaythrough", handleLoadEvent);
    function handleLoadEvent() {
      that.audio.removeEventListener("canplaythrough", handleLoadEvent);
      if (callback) callback();
    }
  }
  play() {
    console.log("PLAYING sound.");
    this.audio.currentTime = 0;
    this.audio.play();
  }
}