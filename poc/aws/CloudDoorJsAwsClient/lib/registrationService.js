'use strict';

const request = require('request-promise-native');
const fs = require('fs');
const path = require('path');

module.exports = class {

  constructor(host) {
    this.host = host;
  }

  async register() {
    const rootPath = path.dirname(require.main.filename);
    const privateKeyPath = path.resolve(rootPath, 'private.pem.key');
    const certPath = path.resolve(rootPath, 'cert.pem.crt');
    const configPath = path.resolve(rootPath, 'config.json');

    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(certPath) || !fs.existsSync(configPath)) {
      const data = await request.post(`${this.host}/device`, {json: true});
      fs.writeFileSync(privateKeyPath, data.keys.private);
      fs.writeFileSync(certPath, data.cert);
      fs.writeFileSync(configPath, JSON.stringify({
        clientId: data.id
      }));
    }

    return {
      clientId: require(configPath).clientId,
      privateKeyPath,
      certPath,
      caPath: path.resolve(rootPath, 'AmazonRootCA1.pem')
    };
  }

};