'use strict';

const Client = require('clouddoorjsawsclient/lib/client');
const AWS = require('aws-sdk');
const path = require('path');
const chai = require('chai');
chai.should();

const IOT_ENDPOINT = 'a9zrzf1iwbvv8-ats.iot.eu-west-1.amazonaws.com';
const HTTP_ENDPOINT = 'https://ptuqtplhyh.execute-api.eu-west-1.amazonaws.com/dev';

describe('GIVEN the AWS-based CloudDoor client', () => {

  let client;
  let admin;
  let iotdata;

  before(() => {
    iotdata = new AWS.IotData({region: 'eu-west-1', endpoint: IOT_ENDPOINT});
    const rootDir = __dirname;
    client = new Client(IOT_ENDPOINT, HTTP_ENDPOINT, {
      clientId: '07ba071c-e923-4580-9c22-81cfa84339c5',
      privateKeyPath: path.resolve(rootDir, 'client1Cert', 'private.pem.key'),
      certPath: path.resolve(rootDir, 'client1Cert', 'cert.pem.crt'),
      caPath: path.resolve(rootDir, 'client1Cert', 'AmazonRootCA1.pem')
    });
    admin = new Client(IOT_ENDPOINT, HTTP_ENDPOINT, {
      clientId: '4edd2fa7-6818-4f5d-af34-3058749e08f1',
      privateKeyPath: path.resolve(rootDir, 'client2Cert', 'private.pem.key'),
      certPath: path.resolve(rootDir, 'client2Cert', 'cert.pem.crt'),
      caPath: path.resolve(rootDir, 'client2Cert', 'AmazonRootCA1.pem')
    });
    return Promise.all([
        client.start(),
        admin.start()
    ]);
  });

  after(() => {
    client.kill();
    admin.kill();
  });

  it('WHEN pinging the client, it pongs back', done => {
    admin.handlers.onMessage = data => {
      data.ping.should.equal('pong');
      done();
    };
    iotdata.publish({
      topic: client.id,
      qos: 1,
      payload: JSON.stringify({
        command: 'ping',
        data: {
          target: admin.id
        }
      })
    }).promise();
  });

});