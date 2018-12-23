'use strict';

const Client = require('./lib/client');
const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  {name: 'httpHost', alias: 'h', type: String},
  {name: 'iotHost', alias: 'i', type: String}
]);

if (!options.httpHost) {
  console.error('You have to specify the httpHost option');
  return;
}

if (!options.iotHost) {
  console.error('You have to specify the iotHost option');
  return;
}

const client = new Client(options.iotHost, options.httpHost);
client.start();