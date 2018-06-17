'use strict';

const Pubsub = require('@google-cloud/pubsub');

const pubsub = new Pubsub();

const createPubSubTopic = topicName => {
  return new Promise((resolve, reject) => {
    pubsub.createTopic(topicName, (err, topic) => {
      // topic already exists.
      if (err) {
        if (err.code === 6) {
          console.log(`The topic ${topicName} already existed`);
          resolve(pubsub.topic(topicName));
          return;
        }
        reject(err);
        return;
      }

      console.log(`Created a Pub/Sub topic ${topicName}`);
      resolve(topic);
    });
  });
};

const createSubscription = (topicName, topic) => {
  return new Promise((resolve, reject) => {
    topic.createSubscription(topicName, (err, sub) => {
      if (err) {
        if (err.code === 6) {
          console.log(`A subscription for topic ${topicName} already exists`);
          resolve();
          return;
        }
        reject(err);
        return;
      }
      console.log(`Created a Pub/Sub subscription ${topicName}`);
      resolve(sub);
    });
  });
};

module.exports.createCommunicationChannel = uuid => {
  const topicName = `client-${uuid}`;
  return createPubSubTopic(topicName)
    .then(topic => createSubscription(topicName, topic))
    .then(() => topicName);
};