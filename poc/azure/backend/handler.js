'use strict';

const { Client } = require('azure-iothub');

const executeRemoteCommand = (deviceId, connectionString) => {
  const client = Client.fromConnectionString(connectionString);

  const methodParams = {
    methodName: 'Ping',
    payload: {},
    responseTimeoutInSeconds: 30
  };

  return new Promise((resolve, reject) => {
    client.invokeDeviceMethod(deviceId, methodParams, function (err, result) {
      err ? reject(err) : resolve(result);
    });
  });
};

module.exports.hello = async context => {

  try {
    const result = await executeRemoteCommand( 'MyNodeDevice', 'HostName=cloudDoorIot.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=Fa4MqRjIqOvIZH0n8Y4JLUX4aWuskouEeH4IUHAVZlU=');
    context.log(`Received response: ${result}`);
    context.res = {
      headers: {
        "Content-Type": 'application/json'
      },
      body: result
    };
  } catch (err) {
    context.log(err);
    context.res = {
      status: 500,
      headers: {
        "Content-Type": 'application/json'
      },
      body: {
        message: "Failed to execute the remote command",
        details: err.message
      }
    };
  }
};
