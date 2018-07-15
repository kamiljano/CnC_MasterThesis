'use strict';

const request = require('request-promise');

class CloudDoorClient {
  constructor(id, data) {
    for (const key of Object.keys(data)) {
      this[key] = data[key];
    }
    this.id = id;
  }
}

module.exports.StandaloneClientManager = class {

  constructor({server}) {
    this.server = server;
  }

  listAll() {
    return request.get(`${this.server}/clients`, {json: true});
  }

  browse(clientId, path) {
    return request.get(`${this.server}/clients/${clientId}/files`, {
      json: true,
      qs: {
        path
      }
    });
  }
};