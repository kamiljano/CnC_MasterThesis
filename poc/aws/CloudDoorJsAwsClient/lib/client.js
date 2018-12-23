'use strict';

const RegistrationService = require('./registrationService');
const PushNotificationService = require('./pushNotificationService');

const COMMAND_PROCESSORS = Object.freeze({
  ping: require('./processors/pingProcessor')
});

module.exports = class {

  constructor(iotHost, httpHost, registrationData, handlers = {}) {
    this.registrationService = new RegistrationService(httpHost);
    this.iotHost = iotHost;
    this.registrationData = registrationData;
    this.handlers = handlers;
  }

  async start() {
    if (!this.registrationData) {
      this.registrationData = await this.registrationService.register();
    }
    this.id = this.registrationData.clientId;
    this.pushNotificationService = new PushNotificationService(this.iotHost, this.registrationData);

    await this.pushNotificationService.subscribe(this.registrationData.clientId, async data => {
      if (this.handlers && this.handlers.onMessage) {
        await this.handlers.onMessage(data);
        return;
      }
      if (!data.command) {
        console.error('The provided message does not provide mandatory command attribute. ' + data);
        return;
      }
      const processor = COMMAND_PROCESSORS[data.command];
      if (!processor) {
        console.error(`The command ${data.command} is not mapped to any command processor`);
        return;
      }
      await processor(this.pushNotificationService, data.data);
    });
  }

  kill() {
    this.pushNotificationService.end();
  }
};