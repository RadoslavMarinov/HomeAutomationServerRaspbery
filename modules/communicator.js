var colors = require("colors/safe");
var parser = require("./uart-parser");
const StateMachine = require("./state-machine").StateMachine;
var transmitter = require("./uart-transmitter")();
var utils = require("./communicator-util");
var util = require("util");
var EventEmitter = require("events");
var clients = require("./clients");
var uartSender = require("./uart-queue").queue;
// var util = require("util");
const commandEnd = "\r\n";

setInterval(() => {
  uartSender
    .put("AT" + commandEnd)
    .then(function(ms) {
      console.log("Pro resolveds", ms.toString());
    })
    .catch(function(ms) {
      console.log(ms);
    });
}, 1000);

/* ********************************************************************************************************************* */
/* ********************************************************************************************************************* */
/* ********************************************************************************************************************* */
/* ********************************************************************************************************************* */
/* ********************************************************************************************************************* */
/* ********************************************************************************************************************* */
/* ********************************************************************************************************************* */
/* ********************************************************************************************************************* */
/* ********************************************************************************************************************* */
/* ********************************************************************************************************************* */
resolver = function() {};

var states = new StateMachine(["idle", "init", "running"], "idle");
states.attachSubStateTo(
  "init",
  [
    "diable-echo",
    "test-com",
    "set-mode",
    "confAP",
    "conf-ap-ip",
    "enable-dhcp"
  ],
  "diable-echo"
);

states.attachSubStateTo(
  "running",
  ["update-client-list", "control"],
  "update-client-list"
);

// var  = new StateMachine(["at", "set-mode", "confAP"], "at");
parser.on("restart", function(data) {
  let { event } = data;
  // console.log("ÄSDASDAS");
  eventDispatcher[event](event);
});

/*  EVENT Listeners for user Events */
function uarParserInitListener(data) {
  let { event } = data;
  try {
    eventDispatcher[event](data);
  } catch (error) {
    console.log(error);
  }
}

parser.on("uart parser", uarParserInitListener);

/* Object that containst all the user-event handlers */
class EventDispatcher extends EventEmitter {
  constructor() {
    super();

    this.unknownData = this.unknownData.bind(this);
  }
  // --
  unknownData(data) {
    // console.log("unknownData", data.data.toString());
    switch (states.currentState) {
      case "running": {
        let emit = this.emit.bind(this);

        utils.dispatchRunning(states.substates["running"], data);
        break;
      }
    }
    // console.log(data.data.toString().split(","));
  }
  /* OK */
  ok() {
    switch (states.currentState) {
      /* ------ */
      case "init": {
        let substate = states.substates["init"];
        if (utils.dispatchInit(substate) === "done") {
          console.log(
            colors.inverse.green("Communicator: Initialization succeded!")
          );
          // parser.off("uart parser", uarParserListener);
          enterStateRunningSubstate("update-client-list");
        }
        break;
      }
      case "running": {
        //This OK event means that the Client List request has been collected and finished
        let emit = this.emit.bind(this);
        utils.dispatchRunning(
          states.substates["running"],
          { event: "OK", data: null },
          () => {
            enterStateRunningSubstate("control");
          }
        );
        break;
      }
    } // Swtch End
  }

  //--
  /* READY */
  ready() {
    restartWifi(states);
    // transmitter.send("AT\r\n");
  }

  /* RESTART */
  restart(event) {
    restartWifi(states);
  }
  /* ERROR */
  error() {
    console.log("ESP ERROR");
  }
}
// End of Event Dispatcher
// --
var eventDispatcher = new EventDispatcher();

enterStateRunningSubstate = function(substate) {
  // console.log("Enmter stat Runnubng")
  states.setState("running").setState(substate);
  //
  //
  switch (substate) {
    case "update-client-list": {
      transmitter.requestConnectedClients();
      // Listener
      function showData(data) {
        console.log("Listener", data);
        if (data === "OK") {
        }
        // eventDispatcher.off("uData", showData);
        // console.log(util.inspect(eventDispatcher.listenerCount("uData")));
      }
      break;
    }
    case "control": {
      console.log("Enter Control");
      eventDispatcher.removeAllListeners("uData");

      setTimeout(function() {
        enterStateRunningSubstate("update-client-list");
      }, 1500);

      break;
    }
  }

  // utils.dispatchRunning(substate, function() {
  //   states.substates["running"].setState("control");
  //   console.log("State = running, control");
  // });
};

restartWifi = function(states) {
  console.log(colors.cyan("RestartVIFI"));
  state = states.currentState;
  states.setState("init").setState("diable-echo");
  transmitter.disableEcho();
};
/*   This Function must be at the bottom;
 Issued at the beginning in order to restart the netwokr when 
server restarts */
var resetTarget = new Promise((resolve, reject) => {
  resolver = resolve;
});

transmitter.resetTarget();
