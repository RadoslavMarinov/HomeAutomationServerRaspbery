var colors = require("colors/safe");
var transmitter = require("./uart-transmitter")();
var parser = require("./uart-parser");
var Semafor = require("./semafor");

const uartSem = new Semafor();

// setInterval(() => {
//   console.log(queue.funcQueue);
//   console.log("-----------------");
// }, 200);

class Queue {
  constructor() {
    this.funcQueue = [];
    setInterval(() => {
      this.checkForTask();
    }, 2000);
    // setInterval(() => {
    //   console.log(uartSem.use);
    //   console.log(this.funcQueue);
    // }, 500);
  }

  // --

  put(message, msgDelim, resTime, releaseUartSem) {
    var responseTimeout = resTime || 100;

    return new Promise((resolve, reject) => {
      this.funcQueue.push({
        func: function() {
          parser.cb = resolve;
          parser.msgDelim = msgDelim || "OK";
          transmitter.send(message);
          // --
          setTimeout(() => {
            reject(
              "Response timeout expired! Expected response " +
                '"' +
                msgDelim +
                '"' +
                " did not arrived from ESP"
            );
          }, resTime || 1000);
        },
        message: message
      });
    });
  }

  //   --

  checkForTask() {
    if (typeof this.funcQueue[0] !== "undefined" /*  && uartSem.use */) {
      console.log(colors.grey("Hadle message: " + this.funcQueue[0].message));
      // uartSem.take();
      // console.log("SSSSSSSSS", parser.msgDelim);
      this.funcQueue[0].func();
      this.funcQueue = this.funcQueue.slice(1);
      return true;
    } else if (uartSem.use === false) {
    }
  }
}

// -- Helpers

// -- End

var queue = new Queue();

module.exports = { queue: queue };
