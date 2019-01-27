'use strict';

const request = require('request-promise-native');
const { Client } = require('simulated-device/lib/client');

module.exports.RemoteClient = class extends Client{

  constructor(url, connectionString) {
    super(connectionString);
    this.url = url;
  }

  ping() {
    return request.post(this.url, {
      json: true,
      timeout: 3000
    });
  }

};