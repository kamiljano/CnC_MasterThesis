'use strict';

const Datastore = require('@google-cloud/datastore');
const uuid = require('uuidv4');
const clientPubSubService = require('./clientPubSubService');

const CLIENTS_DOCUMENT = 'client';

const datastore = new Datastore();

const getUniqueUuid = () => {
  const uniqueUuid = uuid();
  const query = datastore.createQuery(CLIENTS_DOCUMENT)
    .filter('__key__', '=', datastore.key([CLIENTS_DOCUMENT, uniqueUuid]));
  return datastore.runQuery(query)
    .then(results => {
      if (results[0].length === 0) {
        return uniqueUuid;
      }
      return getUniqueUuid();
    });
};

const storeInDatastore = (uuid, data) => {
  const result = {
    os: {
      type: data.os.type,
      version: data.os.version
    },
    cpus: data.cpus.map(cpu => ({model: cpu.model, speed: cpu.speed})),
    totalMemory: data.totalMemory,
    user: data.user,
    lastRegistration: new Date().getTime()
  };
  return datastore.save({
    key: datastore.key([CLIENTS_DOCUMENT, uuid]),
    data: result
  }).then(() => result);
};

const getClientUuid = data => {
  if (data.uuid) {
    console.log(`Updating client ${data.uuid}`);
    return Promise.resolve(data.uuid);
  }
  return getUniqueUuid()
    .then(uuid => {
      console.log(`Creating a new user with UUID ${uuid}`);
      return uuid;
    });
};

module.exports.registerClient = data => {
  let clientUUID;
  return getClientUuid(data)
    .then(uuid => {
      clientUUID = uuid;
      return Promise.all([
        storeInDatastore(uuid, data),
        clientPubSubService.createCommunicationChannel(uuid)
      ]);
    }).then(([storedInfo, topicName]) => {
      storedInfo.uuid = clientUUID;
      storedInfo.topic = topicName;
      return storedInfo;
    });
};