'use strict';

const ClientManager = require('./clientManager').StandaloneClientManager;

module.exports.StandaloneAdminiClient = class {
  constructor({server}) {
    this.clientManager = new ClientManager({server});
  }

  start() {

  }
};