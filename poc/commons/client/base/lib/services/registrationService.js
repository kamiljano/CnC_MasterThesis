'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');

const OS_MAPPING = {
  darwin: 'macos',
  freebsd: 'freebsd',
  linux: 'linux',
  sunos: 'sunos',
  win32: 'windows'
};

const getOs = () => {
  return OS_MAPPING[os.platform()];
};

const getUuidTargetDir = () => path.join(os.homedir(), '.ssh');
const getUuidTargetFile = () => path.join(getUuidTargetDir(), 'host.json');

const saveUuid = uuid => {
  const targetDir = getUuidTargetDir();
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  fs.writeFileSync(getUuidTargetFile(), JSON.stringify({uuid}));
};

module.exports.RegistrationService = class {
  constructor(backend) {
    this.backend = backend;
  }

  async register() {
    const deviceDetails = {
      os: {
        type: getOs(),
        version: os.release()
      },
      cpus: os.cpus(),
      totalMemory: os.totalmem(),
      user: os.userInfo().username
    };

    try {
      const uuid = require(getUuidTargetFile()).uuid;
      deviceDetails.uuid = uuid;
    } catch(err) {
      console.log('First time registration. A new UUID will be assigned to the client');
    }

    const registeredData = await this.backend.register(deviceDetails);
    saveUuid(registeredData.uuid);
    return registeredData;
  }
};