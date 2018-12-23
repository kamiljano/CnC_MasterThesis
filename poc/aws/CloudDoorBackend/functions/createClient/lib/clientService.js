'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

const CLOUD_DOOR_CLIENT_TYPE = 'CloudDoorClient';

const createThingType = async iot => {
  try {
    await iot.createThingType({thingTypeName: CLOUD_DOOR_CLIENT_TYPE}).promise();
  } catch(err) {
    //NOP
  }
};

const createThing = async (deviceId, iot) => {
  try {
    const result = await iot.createThing({
      thingName: deviceId,
      thingTypeName: CLOUD_DOOR_CLIENT_TYPE
    }).promise();
    console.log(JSON.stringify({message: `Successfully created the thing ${deviceId}`}));
    return result;
  } catch (err) {
    console.err(JSON.stringify({
      message: 'Failed to create a new thing with ID: ${deviceId}',
      error: err.message
    }));
    throw err;
  }
};

const createCertificate = async iot => {
  try {
    const result = await iot.createKeysAndCertificate({
      setAsActive: true
    }).promise();
    console.log(JSON.stringify({message: `Successfully created the certificate ${result.certificateId}`}));
    return result;
  } catch (err) {
    console.err(JSON.stringify({
      message: `Failed to create a new certificate`,
      error: err.message
    }));
  }
};

const createPolicy = (iot, policyName) => iot.createPolicy({
  policyName,
  policyDocument: JSON.stringify({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "iot:Publish",
          "iot:Subscribe",
          "iot:Connect",
          "iot:Receive"
        ],
        "Effect": "Allow",
        "Resource": [
          "*"
        ]
      }
    ]
  })
}).promise();

const attachPolicy = (iot, policyName, certArn) => iot.attachPolicy({
  policyName,
  target: certArn
}).promise();

const attachThing = (iot, thingName, certArn) => iot.attachThingPrincipal({
  principal: certArn,
  thingName
}).promise();

class Client {

  constructor(clientId, cert) {
    this.id = clientId;
    this.keys = {
      public: cert.keyPair.PublicKey,
      private: cert.keyPair.PrivateKey
    };
    this.cert = cert.certificatePem;
  }

}

module.exports.createClient = async () => {
  const iot = new AWS.Iot();
  await createThingType(iot); //As of 2018-12-24, it's not possible to pre-create thing type with a cloud formation template

  const deviceId = uuid(); //TODO: make sure that it's unique
  const policyName = `${deviceId}-access`;

  const [device, cert, policy] = await Promise.all([
      createThing(deviceId, iot),
      createCertificate(iot),
      createPolicy(iot, policyName)
  ]);

  await Promise.all([
    attachPolicy(iot, policyName, cert.certificateArn),
    attachThing(iot, deviceId, cert.certificateArn)
  ]);

  return new Client(deviceId, cert);
};