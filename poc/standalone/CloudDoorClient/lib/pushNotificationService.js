'use strict';

const io = require('socket.io-client');
const ss = require('socket.io-stream');
const {ReadStream} = require('fs');

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
      try {
        const response = await onMessage(data);
        if (data.txId) {
          if (response instanceof ReadStream) {
            await this.stream(data.txId, response);
          } else {
            await this.publish(data.txId, response);
          }
        }
      } catch (err) {
        if (data.txId) {
          await this.publish(data.txId, err);
        }
      }
    });
  }

  publish(topic, message) {
    return new Promise(resolve => {
      this.socket.emit(topic, message, resolve);
    });
  }

  stream(topic, dataStream) {
    const outputStream = ss.createStream();
    ss(this.socket).emit(topic, outputStream, null, () => {
      console.log('asdf');
    });
    dataStream.pipe(outputStream);
  }
};