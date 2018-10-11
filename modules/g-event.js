const EventEmitter = require("events");

class GlobalEmitter extends EventEmitter {}

const gEmiter = new GlobalEmitter();

module.exports = gEmiter;
