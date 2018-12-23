'use strict';

const Server = require('./lib/server').Server;
const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  {name: 'port', alias: 'p', type: Number, defaultValue: process.env.PORT},
  {name: 'redis.host', type: String},
  {name: 'redis.port', type: Number},
]);

const redis = !(options['redis.host'] || options['redis.port']) ? undefined : {
  host: options['redis.host'],
  port: options['redis.port']
};

new Server({
  port: options.port,
  redis
}).start();

module.exports.Server = Server;