var transmitter = require("./uart-transmitter")();
var parser = require("./uart-parser");

class Queue {
  constructor() {
    this.funcQueue = [];
  }

  // --

  put(message) {
    // return new Promise(function(resolve, reject) {
    console.log("put");

    setTimeout(() => {
      this.checkForMessages();
    }, 1);

    return new Promise((resolve, reject) => {
      this.funcQueue.push({
        func: function() {
          parser.cb = resolve;
          transmitter.send(message);
          setTimeout(() => {
            reject("Response timeout expired!");
          }, 1000);
        },
        message: message
      });
    });
  }

  //   --

  checkForMessages() {
    if (this.funcQueue[0] !== undefined) {
      uartSemafor.take(this.funcQueue[0].message);
      console.log("cfm");
      this.funcQueue[0].func();
      this.funcQueue = this.funcQueue.slice(1);
      // console.log(this.funcQueue);
      return true;
    } else {
      return false;
    }
  }
}

// -- Helpers

// -- End

class Semafor {
  constructor() {
    this.isAvailable = true;
    this.taker = "";
  }

  take(proccess) {
    this.isAvailable = false;
    this.taker = process;
  }

  release(proccess) {
    if (this.isAvailable === true) {
      throw new Error(
        "Semafor is already released! There is flaw in the logic!"
      );
    }
    this.isAvailable = false;
  }
}

var uartSemafor = new Semafor();
var queue = new Queue();

module.exports = { queue: queue };
