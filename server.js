const express = require("express");
var communicator = require("./modules/communicator");
var uartParser = require("./modules/uart-parser");
/* SOCKET IO Stuff *********************************************/
const port = 3333;
const socktServerUrl = "https://riko-express-react-learning.herokuapp.com/";
var socket = require("socket.io-client")(socktServerUrl);

socket.on("connect", function() {
  console.log("SocketIO client connected!");
  socket.emit("I am", "Home server");
});
socket.on("button", function(data) {
  console.log(data);
});
socket.on("disconnect", function() {
  console.log("SocketIO client disconected!");
});
