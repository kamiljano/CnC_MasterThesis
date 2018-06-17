'use strict';

const PubSub = require(`@google-cloud/pubsub`);

const pubsub = new PubSub();

const ADMIN_TOPIC = 'projects/clouddoor-dev/topics/admin';

module.exports = class {
  subscribe(topic, onMessage) {
    const subscription = pubsub.subscription(topic);
    subscription.on('message', async message => {
      console.log(`Received message ${JSON.stringify(message)}`);
      try {
        const result = await onMessage(JSON.parse(message.data));
        this.publish(ADMIN_TOPIC, {
          success: true,
          result
        });
      } catch (err) {
        this.publish(ADMIN_TOPIC, {
          success: false,
          result: {
            message: err.message,
            stack: err.stack
          }
        })
      } finally {
        message.ack();
      }
    });
  }

  publish(topic, message) {
    return pubsub
      .topic(topic)
      .publisher()
      .publish(Buffer.from(JSON.stringify(message)));
  }
};