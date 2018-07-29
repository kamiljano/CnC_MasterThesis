'use strict';

const Server = require('./lib/server').Server;
const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  {name: 'port', alias: 'p', type: Number, defaultOption: 666}
]);

new Server({
  port: options.port
}).start();

module.exports.Server = Server;