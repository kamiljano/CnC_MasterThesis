'use strict';

const AdminClient = require('./bin/service/cloudDoorAdmin').AdminClient;
const CommandLineProcessor = require('./bin/cmd/commandLineProcessor').CommandLineProcessor;

const PubSub = require('@google-cloud/pubsub');

const pubsub = new PubSub();

console.log('Welcome to CloudDoorAdmin app');

const admin = new AdminClient({
  adminTopic: 'projects/clouddoor-dev/subscriptions/admin'
});
admin.start();

new CommandLineProcessor(admin).start();