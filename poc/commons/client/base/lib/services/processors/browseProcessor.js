'use strict';

const os = require('os');
const drivelist = require('drivelist');
const fs = require('fs');

class WrongPathError extends Error {
  constructor(path) {
    super(`The path ${path} does not exist`);
  }
}

const FILE_TYPE = Object.freeze({
  DIRECTORY: 'dir',
  FILE: 'file'
});

const getDrivesInfo = () => new Promise((resolve, reject) => {
  drivelist.list((error, drives) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(drives);
  });
});

const listDrives = async () => {
  const drivesData = await getDrivesInfo();
  return drivesData
    .map(data => data.mountpoints && data.mountpoints.length ? {
      path: data.mountpoints[0].path.replace('/', '').replace('\\', ''),
      type: FILE_TYPE.DIRECTORY
    } : null)
    .filter(data => data);
};

module.exports = request => {
  if (request.path === '/' && os.platform() === 'win32') {
    return listDrives();
  }
  if (!fs.existsSync(request.path)) {
    throw new WrongPathError(request.path);
  }
  return fs.readdirSync(request.path).map(file => {
    return file;
  });
};