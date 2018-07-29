'use strict';

const Client = require('./client');
const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  {name: 'urlBase', alias: 'u', type: String, defaultOption: 'http://localhost:666'}
]);

new Client({urlBase: options.urlBase || 'http://localhost:666'}).start();