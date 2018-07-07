'use strict';

const Datastore = require('@google-cloud/datastore');
const PubSub = require('@google-cloud/pubsub');
const Storage = require('@google-cloud/storage');

const datastore = new Datastore();
const pubsub = new PubSub();
const storage = new Storage();

class CloudDoorClient {
  constructor(id, data) {
    for (const key of Object.keys(data)) {
      this[key] = data[key];
    }
    this.id = id;
  }
}

module.exports.ClientManager = class {
  async listAll() {
    const result = await datastore.runQuery(datastore.createQuery('client'));
    return result[0].map(entry => new CloudDoorClient(entry[Object.getOwnPropertySymbols(entry)[0]].name, entry));
  }

  browse(id, path) {
    return pubsub
      .topic(`projects/clouddoor-dev/topics/client-${id}`)
      .publisher()
      .publish(Buffer.from(JSON.stringify({operation: 'browse', details: {path}})));
  }

  upload(id, path) {
    //TODO: acquire a signed URL
    //TODO: send a request to the client
  }
};