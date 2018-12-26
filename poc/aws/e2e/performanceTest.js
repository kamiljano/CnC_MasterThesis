'use strict';

const Client = require('clouddoorjsawsclient/lib/client');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  {name: 'output', alias: 'o', type: String},
  {name: 'clients', type: Number, defaultValue: 1},
  {name: 'override', type: Boolean, defaultValue: false},
  {name: 'iotEndpoint', type: String},
  {name: 'httpEndpoint', type: String}
]);

if (!options.iotEndpoint || !options.httpEndpoint) {
  console.error('The parameters iotEndpoint and httpEndpoint are mandatory in order to register and the new client and then subscribe to a pub/sub topic');
  return;
}

if (options.override && options.output && fs.existsSync(options.output)) {
  fs.unlinkSync(options.output);
}

const iotdata = new AWS.IotData({region: 'eu-west-1', endpoint: options.iotEndpoint});

const rootDir = __dirname;
const client = new Client(options.iotEndpoint, options.httpEndpoint, {
  clientId: '07ba071c-e923-4580-9c22-81cfa84339c5',
  privateKeyPath: path.resolve(rootDir, 'client1Cert', 'private.pem.key'),
  certPath: path.resolve(rootDir, 'client1Cert', 'cert.pem.crt'),
  caPath: path.resolve(rootDir, 'client1Cert', 'AmazonRootCA1.pem')
});
const admin = new Client(options.iotEndpoint, options.httpEndpoint, {
  clientId: '4edd2fa7-6818-4f5d-af34-3058749e08f1',
  privateKeyPath: path.resolve(rootDir, 'client2Cert', 'private.pem.key'),
  certPath: path.resolve(rootDir, 'client2Cert', 'cert.pem.crt'),
  caPath: path.resolve(rootDir, 'client2Cert', 'AmazonRootCA1.pem')
});

const logTime = async (clientNo, runnable) => {
  const start = new Date().getTime();
  await runnable();
  const duriation = new Date().getTime() - start;
  if (options.output) {
    fs.appendFileSync(options.output, `${clientNo},${duriation}\r\n`);
  }
};

const executeCommand = () => {
  return new Promise((resolve, reject) => {
    admin.handlers.onMessage = () => resolve();

    iotdata.publish({
      topic: client.id,
      qos: 1,
      payload: JSON.stringify({
        command: 'ping',
        data: {
          target: admin.id
        }
      })
    }).promise().catch(err => reject(err));
  });
};

(async () => {
  await Promise.all([
      client.start(),
      admin.start()
  ]);

  for (let i = 0; i < options.clients; i++) {
    console.log(`Sending command ${i}`);
    await logTime(i + 1, () => executeCommand());
  }

  client.kill();
  admin.kill();

})();