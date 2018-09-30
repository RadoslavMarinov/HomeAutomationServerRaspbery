var SerialPort = require("serialport");

const COM_PORT = "COM19";
var port = new SerialPort(COM_PORT, {
  baudRate: 115200
});

// Standard Listeners **************************************
port.on("open", function(err) {
  if (err) {
    console.log(COM_PORT, " Failed to open!");
  } else {
    console.log(COM_PORT, " opened!");
  }
});

module.exports = { port: port };
