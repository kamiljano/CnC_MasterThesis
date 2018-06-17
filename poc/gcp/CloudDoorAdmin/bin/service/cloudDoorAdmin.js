'use strict';

const PubSub = require('@google-cloud/pubsub');

const pubsub = new PubSub();

const ClientManager = require('./clientManager').ClientManager;

const subscribeForResponses = (adminTopic, client) => {
  const subscription = pubsub.subscription(adminTopic);
  subscription.on('message', async message => {
    try {
      if (client.clientManager.onClientResponse) {
        await client.clientManager.onClientResponse(JSON.stringify(JSON.parse(message.data)));
        client.clientManager.onClientResponse = null;
      }
    } finally {
      message.ack();
    }
  });
};

module.exports.AdminClient = class {
  constructor(data) {
    this.adminTopic = data.adminTopic;
    this.clientManager = new ClientManager();
  }

  start() {
    subscribeForResponses(this.adminTopic, this);
  }
};