var colors = require("colors");
class Semafor {
  constructor() {
    this.use = true;
    this.isFree = this.isFree.bind(this);
    this.release = this.release.bind(this);
    this.take = this.take.bind(this);
  }

  take() {
    console.log("TAKEN".grey);
    this.use = false;
  }

  release() {
    console.log("RELEASED".grey);
    this.use = true;
  }

  isFree() {
    return this.use;
  }
}
// var uartSem = new Semafor();
module.exports = Semafor;
