var colors = require("colors/safe");
var parser = require("./uart-parser");
const StateMachine = require("./state-machine").StateMachine;
var transmitter = require("./uart-transmitter")();
var utils = require("./communicator-util");
var util = require("util");

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

// var  = new StateMachine(["at", "set-mode", "confAP"], "at");
var eventDispatcher = new EventDispatcher();

/*  EVENT Listeners for user Events */
parser.on("uart parser", function(data) {
  let { event } = data;
  try {
    eventDispatcher[event]();
  } catch (error) {
    console.log(error);
  }
});

setTimeout(() => {
  console.log(states);
}, 2000);

/* Object that containst all the user-event handlers */
function EventDispatcher() {
  /* OK */
  this.ok = function() {
    switch (states.currentState) {
      /* ------ */
      case "init": {
        let substate = states.substates["init"];
        let initialization = "";
        initialization = utils.dispatchInit(substate);
        if (initialization === "done") {
          states.setState("running");
          // console.log(util.inspect(states, { showHidden: true, depth: null }));
        }
        break;
      }
    }
  };
  /* SAP configuration OK */

  /* READY */
  this.ready = function() {
    state = states.currentState;
    states.setState("init").setState("diable-echo");
    console.log('Event "ready" fired!');
    transmitter.disableEcho();
    // transmitter.send("AT\r\n");
  };
  /* ERROR */
  this.error = function() {
    console.log("ESP ERROR");
  };
}
