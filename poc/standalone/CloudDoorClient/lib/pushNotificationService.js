'use strict';

const io = require('socket.io-client');

const buildSocket = url => {
  const result = io(url);
  result.on('connect', () => {
    console.info('Connected to the pubsub');
  });
  result.on('disconnect', () => {
    console.info('Disconnected from the pubsub');
  });
  return result;
};

module.exports.PushNotificationService = class {

  constructor(url, onConnect) {
    this.onConnect = onConnect;
    this.socket = buildSocket(url);
  }

  subscribe(topic, onMessage) {
    if (this.onConnect) {
      this.socket.on('connect', this.onConnect);
    }
    this.socket.on('command', async data => {
      console.info('Received a command');
      const response = await onMessage(data);
      if (data.txId) {
        await this.publish(data.txId, response);
      }
    });
  }

  publish(topic, message) {
    return new Promise(resolve => {
      this.socket.emit(topic, message, resolve);
    });
  }

};