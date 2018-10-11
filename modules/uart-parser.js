var serialPort = require("./uart").port;

var eventEmiter = require("events");
var gEmiter = require("./g-event");
var colors = require("colors/safe");
var util = require("util");

var parser = new Parser();

util.inherits(Parser, eventEmiter);

serialPort.on("data", function(data) {
  // console.log(data);
  try {
    parser.analyse(data, function(response) {
      // console.log("Response is: " + response);
    });
  } catch (error) {
    console.log(colors.red(error));
  }
});

function Parser() {
  this.receiveBuffer = Buffer.alloc(0);

  this.message = [];
  this.msgDelim = "";
  this.releaseUartSem = undefined;

  this.cb = function(data) {};
  /* GET_FRAME() ******************************** */
  this.analyse = function(data) {
    // *

    var dataLength = data.length,
      index = 0;

    while (index < dataLength) {
      while (
        index < dataLength &&
        data[index] !== 0x0d &&
        data[index] !== 0x0a
      ) {
        this.receiveBuffer = Buffer.concat([
          this.receiveBuffer,
          Buffer.from([data[index]])
        ]);

        index++;
      }

      // --
      if (index === dataLength) {
        return;
      }
      var frameBuff = Buffer.from(this.receiveBuffer);
      this.receiveBuffer = Buffer.alloc(0);
      // console.log("Frame Buff: ", frameBuff);
      this.parse(frameBuff);

      // this.cb(frameBuff);

      while (
        (index < dataLength && data[index] === 0x0d) ||
        data[index] === 0x0a
      ) {
        index++;
      }
    }
    // -
  };
  /* PARSE() ******************************** */
  this.parse = function(frame) {
    // console.log(this.msgDelim);
    if (frame.length !== 0) {
      let frameStr = frame.toString("utf-8");
      // console.log(frameStr);

      if (frameStr === this.msgDelim) {
        this.message.push(frameStr);
        // console.log(colors.blue("We have a match ", this.message));
        this.cb(this.message);
        this.releaseUartSem ? this.releaseUartSem() : null;
        this.message = [];
      } else {
        this.message.push(frameStr);
      }
    } else {
      // console.log(colors.grey("Parser message with 0 length"));
    }
  };
}
/* ******************************** */

module.exports = parser;
