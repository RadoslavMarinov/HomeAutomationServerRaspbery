var serialPort = require("./uart").port;
var colors = require("colors/safe");
var util = require("util");
var eventEmiter = require("events").EventEmitter;

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
    var response = undefined;
    if (frame.length !== 0) {
      let frameStr = frame.toString("utf-8");
      //--
      switch (frameStr) {
        case "ready": {
          console.log(colors.blue("@ Target started!"));
          response = frameStr;
          this.message.push(frameStr);
          this.cb(this.message);
          this.message = [];
          // serialPort.write("ATE0\r\n");
          break;
        }
        //Always Returned ECHO upon command ATE0: "serialPort.write("ATE0\r\n");"
        case "ATE0": {
          // console.log("");
          break;
        }
        case "OK": {
          response = frameStr;
          this.message.push(frameStr);
          console.log(this.message);
          this.cb(this.message);
          this.message = [];
          break;
        }
        case "ERROR": {
          response = frameStr;
          this.message.push(frameStr);
          this.cb(this.message);
          this.message = [];

          break;
        }
        default: {
          // console.log("Customn");
          this.message.push(frameStr);
          // console.log(this.message);
          return;
        }
      }
      if (response !== undefined) {
        // this.emit("uart parser", { event: response.toLowerCase() });
      }
    } else {
      // console.log("\r\n");
    }
    // console.log("******* frame delimiter *******".bgCyan);
  };

  // Parse more complex service frames as responses to querys.
  function parseComplexServiceFrame(frame) {
    event = { event: "" };
  }
}
/* ******************************** */

module.exports = parser;
