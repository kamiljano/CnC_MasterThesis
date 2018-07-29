'use strict';

const RegistrationService = require('./lib/services/registrationService').RegistrationService;
const retryOnError = require('./lib/utils/retry').retryOnError;
const messageDispatcherService = require('./lib/services/messageDispatcherService');

class CloudDoorClient {
  constructor(backend) {
    this.registrationTime = backend.registration.registrationTime || init;
    this.registrationService = new RegistrationService(backend.registration.registrationService);
    this.pushNotificationService = backend.pushNotificationService;
  }

  async start() {
    console.log('CloudDoor client started');
    await retryOnError(async () => {
      console.log('Attempting to register the client...');
      const registeredData = this.registrationTime === 'init'
        ? await this.registrationService.register()
        : {};
      console.log('The client has been successfully registered');
      console.log('Subscribing the client to the Pub/Sub topic...');
      if (this.registrationTime === 'afterSubscription') {
        this.pushNotificationService.onConnect = () => {
          this.registrationService.register();
        };
      }
      await this.pushNotificationService.subscribe(registeredData.topic, messageDispatcherService.dispatch);
      console.log('The client has been successfully subscribed to the Pub/Sub topic');
    });
  }

  stop() {
    this.pushNotificationService.stop();
  }
}

module.exports.CloudDoorClient = CloudDoorClient;