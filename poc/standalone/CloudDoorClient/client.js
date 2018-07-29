'use strict';

const CloudDoorClient = require('cloud-door-client-base').CloudDoorClient;
const RegistrationService = require('./lib/registrationService').RegistrationService;
const PushNotificationService = require('./lib/pushNotificationService').PushNotificationService;

module.exports = class {

  constructor({urlBase}) {
    this.urlBase = urlBase;
  }

  start() {
    const pushNotificationService = new PushNotificationService(this.urlBase);

    const client = new CloudDoorClient({
      registration: {
        registrationService: new RegistrationService(pushNotificationService),
        registrationTime: 'afterSubscription'
      },
      pushNotificationService
    });
    this._client = client;
    return client.start();
  }

  stop() {
    this._client.stop();
  }

};