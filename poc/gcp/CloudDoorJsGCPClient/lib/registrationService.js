'use strict';

const request = require('request-promise');

module.exports = class {
  constructor(registrationUrl) {
    this.registrationUrl = registrationUrl;
  }

  register(clientData) {
    return request.post(this.registrationUrl, {
      json: true,
      body: clientData
    });
  }
};