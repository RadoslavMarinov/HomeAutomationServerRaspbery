class Semafor {
  constructor() {
    this.use = true;
  }

  take() {
    this.use = false;
  }

  release() {
    this.use = true;
  }
}

module.exports = Semafor;
