'use strict';

module.exports.RegistrationService = class {

  constructor(pushNotificationService) {
    this.pushNotificationService = pushNotificationService;
  }

  register(clientData) {
    return this.pushNotificationService.publish('register', clientData);
  }

};