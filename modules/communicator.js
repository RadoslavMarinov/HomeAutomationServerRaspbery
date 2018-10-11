var colors = require("colors");
var parser = require("./uart-parser");
const StateMachine = require("./state-machine").StateMachine;
var transmitter = require("./uart-transmitter")();
var utils = require("./communicator-util");
var util = require("util");
var EventEmitter = require("events");
var clients = require("./clients");
var uartSender = require("./uart-queue").queue;
var { uartSemafor } = require("./uart-queue");
var gEvEmiter = require("./g-event");
// var util = require("util");
const commandEnd = "\r\n";
const print = console.log;

// setInterval(() => {

// async function initEsp() {
//   // --
//   let resetEspOkResp = await uartSender.put("AT+RST" + commandEnd); //Restart ESP
//   if (resetEspOkResp[resetEspOkResp.length - 1] !== "OK") {
//     console.log(colors.red("Unexpected  Response upon Reset Command!"));
//   }
//   // --
//   let resetEspReadyResp = await waitEspReady();
//   if (resetEspReadyResp[resetEspReadyResp.length - 1] !== "ready") {
//     console.log(colors.red("Unexpected  Response upon Reset Command!"));
//   }
//   console.log(colors.blue("Esp Ready! "));
// }

gEvEmiter.on("uart/port:open", msg => {
  // initEsp();
  uartSender
    .put("AT+RST" + commandEnd, "ready", 800, true)
    .then(msg => {
      print("ready");
    })
    .catch(function(ms) {
      console.log(colors.red(ms));
    });

  uartSender
    .put("ATE0" + commandEnd, "OK", 100, true)
    .then(msg => {
      print(msg);
    })
    .catch(function(ms) {
      console.log(colors.red(ms));
    });

  uartSender
    .put("AT+CWMODE=" + 2 + commandEnd, "OK", 100, true)
    .then(msg => {
      print(msg);
    })
    .catch(function(ms) {
      console.log(colors.red(ms));
    });

  // --
  // uartSender
  //   .put("ATE0" + commandEnd, "OK", 100, true)
  //   .then(() => {
  //     // uartSemafor.release();
  //   })
  //   .catch(function(ms) {
  //     // console.log(colors.red(ms));
  //   });
  // --
  // uartSender
  //   .put("AT+CWMODE=" + 2 + commandEnd, "OK", 100, true)
  //   .then(() => {
  //     console.log("TADAA");
  //   })
  //   .catch(msg => {
  //     console.log(msg);
  //   });

  // .then(msg => {
  //   console.log(msg);
  // }) //Restart ESP
  // .then(function(ms) {
  //   console.log("ASDDDDD");
  //   uartSemafor.release();
  //   return turnEspEchoOff("OK", 100);
  // })
  // .then(() => {
  //   return turnEspEchoOff();
  // })
  // .then(() => {
  //   uartSemafor.release();
  //   configEspMode("access point");
  // })
  /* Catch Init porcess
     * exeptions!
     */
});

// --
function turnEspEchoOff(expRes, resTime, relUartSem) {
  return uartSender.put("ATE0" + commandEnd, expRes, resTime, relUartSem);
}
// --
function configEspMode(mode, expRes, resTimeout, relUartSem) {
  switch (mode) {
    case "station": {
      return uartSender.put(
        "AT+CWMODE=" + 1 + commandEnd,
        expRes,
        resTimeout,
        relUartSem
      );
    }
    case "access point": {
      return uartSender.put(
        "AT+CWMODE=" + 2 + commandEnd,
        expRes,
        resTimeout,
        relUartSem
      );
    }
    case "access point + station": {
      return uartSender.put(
        "AT+CWMODE=" + 3 + commandEnd,
        expRes,
        resTimeout,
        relUartSem
      );
    }
    default: {
      throw new Error("Invalid argument for 'mode'!");
    }
  }
}
// }, 2000);

/* ********************************************************************************************************************* */
