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
      console.log("Response is: " + response);
    });
  } catch (error) {
    console.log(colors.red(error));
  }
});

function Parser() {
  this.receiveBuffer = Buffer.alloc(0);

  /* GET_FRAME() ******************************** */
  this.analyse = function(data) {
    // *
    for (let index = 0; index < data.length; index++) {
      let current = data[index];
      let next = data[index + 1];
      // -
      if (current !== 0x0d && current !== 0x0a) {
        this.receiveBuffer = Buffer.concat([
          this.receiveBuffer,
          Buffer.from([current])
        ]);
        if (index === data.length - 1) {
          console.log("Buffer is long: " + this.receiveBuffer.length);
        }
      } //
      else {
        if (next !== 0x0a && next !== 0x0d) {
          console.log(
            colors.red(
              "ERROR: Invalid sequence: 0x0D must be followed by 0x0A!"
            )
          );
          return;
        }
        let symbol = index;
        while (data[symbol] !== 0x0a) {
          if (data[symbol] !== 0x0d) {
            console.log(
              colors.red(
                "Invalid ending sequence: after 0x0d must follow 0x0d or 0x0a"
              )
            );
          }
          symbol++;
        }
        if (symbol >= data.length) {
          console.log(colors.red("Parser exceedes buffer bouderies"));
          throw new Error("000").lineNumber;
        }
        index = symbol;
        console.log(
          colors.cyan(
            "index = " + index,
            "Data length = " + data.length,
            "Target char = " + "0x" + data[index].toString(16).toUpperCase(),
            "Receive buff: " +
              (this.receiveBuffer.length > 0 ? this.receiveBuffer : "EMPTY")
          )
        );
        var frameBuff = Buffer.from(this.receiveBuffer);
        this.receiveBuffer = Buffer.alloc(0);
        this.parse(frameBuff);
      }
      // -
    }
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
          response = "ready";
          // serialPort.write("ATE0\r\n");
          break;
        }
        //Always Returned ECHO upon command ATE0: "serialPort.write("ATE0\r\n");"
        case "ATE0": {
          // console.log("");
          break;
        }
        case "OK": {
          response = "OK";
          break;
        }
        case "ERROR": {
          response = "ERROR";
          break;
        }
        default: {
          console.log(frame.toString());
          console.log(colors.red("! Unrecognized frame"));
          break;
        }
      }
      if (response !== undefined) {
        this.emit("uart parser", { event: response.toLowerCase() });
      }
    } else {
      console.log("\r\n");
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
