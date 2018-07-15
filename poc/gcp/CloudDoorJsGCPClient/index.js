'use strict';

const CloudDoorClient = require('cloud-door-client-base').CloudDoorClient;
const RegistrationService = require('./lib/registrationService');
const PushNotificationService = require('./lib/pushNotificationService');

const config = {
  registrationUrl: 'https://us-central1-clouddoor-dev.cloudfunctions.net/CloudDoorRegistrationFunction'
};

const client = new CloudDoorClient({
  registration: {
    registrationService: new RegistrationService(config.registrationUrl),
  },
  pushNotificationService: new PushNotificationService()
});

client.start();