'use strict';

const CloudDoorClient = require('cloud-door-client-base').CloudDoorClient;
const RegistrationService = require('./lib/registrationService').RegistrationService;
const PushNotificationService = require('./lib/pushNotificationService').PushNotificationService;

const urlBase = 'http://localhost:666';

const pushNotificationService = new PushNotificationService(urlBase);

const client = new CloudDoorClient({
  registration: {
    registrationService: new RegistrationService(pushNotificationService),
    registrationTime: 'afterSubscription'
  },
  pushNotificationService
});

client.start();