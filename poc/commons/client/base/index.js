'use strict';

const RegistrationService = require('./lib/services/registrationService').RegistrationService;
const retryOnError = require('./lib/utils/retry').retryOnError;
const messageDispatcherService = require('./lib/services/messageDispatcherService');

class CloudDoorClient {
  constructor(backend) {
    this.registrationService = new RegistrationService(backend.registrationService);
    this.pushNotificationService = backend.pushNotificationService;
  }

  async start() {
    console.log('CloudDoor client started');
    await retryOnError(async () => {
      console.log('Attempting to register the client...');
      const registeredData = await this.registrationService.register();
      console.log('The client has been successfully registered');
      console.log('Subscribing the client to the Pub/Sub topic...');
      this.pushNotificationService.subscribe(registeredData.topic, messageDispatcherService.dispatch);
      console.log('The client has been successfully subscribed to the Pub/Sub topic');
    });
  }
}

module.exports.CloudDoorClient = CloudDoorClient;