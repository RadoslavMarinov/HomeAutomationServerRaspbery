var serialPort = require("./uart").port;

var parser = new Parser();

async function f() {}

serialPort.on("data", function(data) {
  parser.analyse(data);
});

function Parser() {
  this.receiveBuffer = Buffer.alloc(0);
  this.frameBuff = Buffer.alloc(0);

  /* GET_FRAME() ******************************** */
  this.analyse = function(data) {
    // *
    for (let index = 0; index < data.length; index++) {
      let current = data[index];
      let next = data[index + 1];
      // -
      if (current !== 0x0d) {
        this.receiveBuffer = Buffer.concat([
          this.receiveBuffer,
          Buffer.from([current])
        ]);
        if (index === data.length - 1) {
          console.log("Buffer is long: " + this.receiveBuffer.length);
        }
      } //
      else {
        if (next !== 0x0a) {
          console.log(
            "ERROR: Invalid sequence: 0x0D must be followed by 0x0A!"
          );
          return;
          // throw new Error("Invalid sequence: 0x0D must be followed by 0x0A!");
        }
        var frameBuff = Buffer.from(this.receiveBuffer);
        this.receiveBuffer = Buffer.alloc(0);
        index++; // Skip 0x0A
        console.log("----");
        this.parse(frameBuff);
      }
      // -
    }
  };
  /* PARSE() ******************************** */
  this.parse = function(frame) {
    console.log(frame);
  };
}
/* ******************************** */

module.exports = {};
