const express = require('express');

// const app = express();
// var http = require('http').Server(app);

const port = 3333;
const socktServerUrl = 'https://riko-express-react-learning.herokuapp.com/';

var socket = require('socket.io-client')(socktServerUrl);

console.log("Hello Riko");

socket.on('connect', function() {
    console.log("SocketIO client connected!");
    socket.emit("I am", "Home server");
});
socket.on('button', function(data) {
    console.log(data)
});
socket.on('disconnect', function() {
    console.log("SocketIO client disconected!")
});

// app.get('/', (req, res) => res.send('Hello World!'))
// http.listen(port, function() {
//     console.log('Listening on port', port);
// });