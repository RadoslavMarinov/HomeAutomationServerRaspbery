var port = require("./uart").port;
const commandEnd = "\r\n";

function Transmitter(props) {
  //
  this.mode = { ap: 0, station: 1, "ap+station": 2 };
  this.enableDisable = { off: 0, on: 1 };
  //
  this.send = function(data) {
    port.write(Buffer.from(data));
  };
  // -- mode = {"access point" | "station" | "access point + station"}
  this.setMode = function(mode) {
    switch (mode) {
      case "access point": {
        this.send("AT+CWMODE=2" + commandEnd);
        break;
      }
    }
  };
  //   --
  this.disableEcho = function() {
    this.send("ATE0" + commandEnd);
  };
  //   ==
  this.testCommunication = function() {
    this.send("AT" + commandEnd);
  };
  //   == ch{1...13}; enc{0 = OPEN, 2 = WPA_PSK, 3 = WPA2_PSK, 4 = WPA_WPA2_PSK }
  this.configAP = function(ssid, pwd, ch, enc) {
    if (pwd.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    let encoding = enc;
    switch (encoding) {
      case "OPEN":
        encoding = 0;
        break;
      case "WPA_PSK":
        encoding = 2;
        break;
      case "WPA2_PSK":
        encoding = 3;
        break;
      case "WPA_WPA2_PSK":
        encoding = 4;
        break;
      default:
        throw new Error(
          'Wrong argument "enc"! It must be:  OPEN | WPA_PSK | WPA2_PSK | WPA_WPA2_PSK '
        );
    }
    let atArg =
      '"' + ssid + '"' + "," + '"' + pwd + '"' + "," + ch + "," + encoding;
    this.send("AT+CWSAP=" + atArg + commandEnd);
  };
  this.setSoftApIp = function(ip) {
    this.send("AT+CIPAP=" + '"' + ip + '"' + commandEnd);
  };
  // --
  this.setDhcp = function(mode, onof) {
    m = this.mode[mode];
    enableDisable = this.enableDisable[onof];

    this.send("AT+CWDHCP=" + m + "," + enableDisable + commandEnd);
  };
  //   --
  this.requestConnectedClients = function() {
    this.send("AT+CWLIF" + commandEnd);
  };
  // --
  this.reqSoftApMac = function() {
    this.send("AT+CIPAPMAC?" + commandEnd);
  };
  // --
  this.resetTarget = function() {
    this.send("AT+RST" + commandEnd);
  };
}

function transmitter(props) {
  return new Transmitter(props);
}

module.exports = transmitter;
