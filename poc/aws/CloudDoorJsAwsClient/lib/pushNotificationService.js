'use strict';

const awsIot = require('aws-iot-device-sdk');

module.exports = class {

  constructor(host, data) {
    this.host = host;
    this.data = data;
    this.device = awsIot.device({
      keyPath: this.data.privateKeyPath,
      certPath: this.data.certPath,
      caPath: this.data.caPath,
      host: this.host
    });
  }

  subscribe(topic, onMessage) {
    return new Promise((resolve, reject) => {
      this.device.on('connect', () => {
        console.log('Successfully connected');
        this.device.subscribe(topic);
        resolve();
      });

      this.device.on('message', (topic, payload) => {
        onMessage(JSON.parse(String(payload)));
      });

      this.device.on('error', error => {
        console.error(error);
        reject();
      });
    });
  }

  publish(topic, message) {
    this.device.publish(topic, JSON.stringify(message));
  }

  end() {
    this.device.end();
  }

};