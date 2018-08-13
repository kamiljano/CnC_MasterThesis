'use strict';

const {spawn} = require('child_process');
const path = require('path');
const {retry} = require('e2e');
const request = require('request-promise-native');
const pidusage = require('pidusage');

class ServerProcess {
  constructor(process) {
    this._process = process;
  }

  resources() {
    return new Promise((resolve, reject) => pidusage(this._process.pid, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          cpu: stats.cpu,
          memory: stats.memory
        });
      }
    }));
  }

  kill() {
    return this._process.kill();
  }
}

const startServer = async (port, redis) => {
  const urlBase = 'http://localhost:' + port;
  let serverProcess;
  try {
    if (redis) {
      serverProcess = spawn('node', [path.join(path.dirname(require.main.filename), '../CloudDoorServer/app.js'), '--port', port, '--redis.host', redis.host, '--redis.port', redis.port]);
    } else {
      serverProcess = spawn('node', [path.join(path.dirname(require.main.filename), '../CloudDoorServer/app.js'), '--port', port]);
    }
    serverProcess.on('exit', code => {
      if (code === 0) {
        console.log('Server closed successfully');
      } else {
        console.error(`Server process returned code ${code}`);
      }
    });
    serverProcess.stdout.on('data', data => {
      console.log(`SERVER: ${data}`);
    });
    serverProcess.stderr.on('data', data => {
      console.error(`SERVER: ${data}`);
    });
    await retry(() => request.get(`${urlBase}/health`, {json: true}));
    return new ServerProcess(serverProcess);
  } catch (err) {
    console.error(err);
    if (serverProcess) {
      serverProcess.kill();
    }
    throw err;
  }
};

module.exports = {
  startServer
};