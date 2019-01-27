'use strict';

const Mqtt = require('azure-iot-device-mqtt').Mqtt;
const DeviceClient = require('azure-iot-device').Client;

module.exports.Client = class {

  constructor(connectionString) {
    this.client = DeviceClient.fromConnectionString(connectionString, Mqtt);
  }

  start() {
    this.client.onDeviceMethod('Ping', (request, response) => {
      response.send(200, 'Ping-ponging', err => {
        if(err) {
          console.error('An error occurred when sending a method response:\n' + err.toString());
        } else {
          console.log('Response to method \'' + request.methodName + '\' sent successfully.' );
        }
      });

    });
  }

  stop() {
    this.client.close();
  }
};