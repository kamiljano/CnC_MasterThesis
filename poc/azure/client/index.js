'use strict';

const connectionString = 'HostName=cloudDoorIot.azure-devices.net;DeviceId=MyNodeDevice;SharedAccessKey=HfOBUbhDlde71B5AXpCGVjANy6Dlk15/v5gRixoIpcM=';

const { Client } = require('./lib/client');

new Client(connectionString).start();