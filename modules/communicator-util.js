var colors = require("colors/safe");
var transmitter = require("./uart-transmitter")();

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
      console.log(colors.green("Communicator: Initialization succeded!"));
      return "done";
    }
  }
  return "in progress";
}

module.exports = {
  dispatchInit: dispatchInit
};
