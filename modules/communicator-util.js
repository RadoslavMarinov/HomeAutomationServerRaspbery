var colors = require("colors/safe");
var transmitter = require("./uart-transmitter")();
var clients = require("./clients");
// var parser = require("./uart-parser");

function Timer() {
  this.timeoutId = {};

  this.newTimeout = function(cb, t) {
    try {
      clearTimeout(this.timeoutId);
    } catch (error) {}
    this.timeoutId = setTimeout(function() {
      cb();
    }, t);
  };
}

function dispatchInit(substate) {
  switch (substate.currentState) {
    case "diable-echo": {
      substate.setState("test-com");
      transmitter.testCommunication();
      break;
    }
    // --
    case "test-com": {
      substate.setState("set-mode");
      transmitter.setMode("access point");
      break;
    }
    // --
    case "set-mode": {
      substate.setState("confAP");
      transmitter.configAP("esp", "12345678", "5", "WPA2_PSK");
      break;
    }
    // --
    case "confAP": {
      substate.setState("conf-ap-ip");
      transmitter.setSoftApIp("192.168.2.1");
      break;
    }
    // --
    case "conf-ap-ip": {
      substate.setState("enable-dhcp");
      transmitter.setDhcp("ap", "on");
      break;
    }
    // --
    case "enable-dhcp": {
      substate.setState("diable-echo");

      return "done";
    }
  }
  return "in progress";
}
/* ------------------------------------------------------------------------------------- */
function dispatchRunning(substate, data, onDone) {
  let state = substate.currentState;

  switch (state) {
    case "update-client-list": {
      if (data.event === "OK") {
        if (onDone) {
          clients.updateList();
          onDone();
        }
      } else if (data.event === "unknownData") {
        // console.log(data);
        // -- Parse station data
        var stationData = {};
        var stationString = data.data.toString();
        var stationStringTokens = stationString.split(",");
        stationData.ip = stationStringTokens[0];
        stationData.mac = stationStringTokens[1];
        // --/
        // -- Push client to clientBuffer
        clients.put(stationData);

        // console.log(colors.red(stationData));
        if (onDone) {
          onDone(data.data.toString(stationData));
        }
      }
      break;
    }
  }
}

module.exports = {
  dispatchInit: dispatchInit,
  dispatchRunning: dispatchRunning
};
