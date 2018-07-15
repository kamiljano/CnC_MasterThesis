'use strict';

const AdminClient = require('./bin/service/standaloneAdmin').StandaloneAdminiClient;
const CommandLineProcessor = require('admin-commons').AdminCommandLineProcessor;

console.log('Welcome to standalone CloudDoorAdmin app');

const admin = new AdminClient({
  server: 'http://localhost:8080'
});
admin.start();

new CommandLineProcessor(admin).start();