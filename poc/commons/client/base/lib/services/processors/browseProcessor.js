'use strict';

const os = require('os');
const drivelist = require('drivelist');
const fs = require('fs');
const path = require('path');
const {WrongPathError} = require('./errors');

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
  if (!request.path.endsWith('/') && !request.path.endsWith('\\')) {
    request.path += path.sep;
  }
  if (!fs.existsSync(request.path)) {
    throw new WrongPathError(request.path);
  }
  return fs.readdirSync(request.path).map(file => {
    try {
      const stat = fs.statSync(path.join(request.path, file));
      return {
        path: file,
        type: stat.isDirectory() ? FILE_TYPE.DIRECTORY : FILE_TYPE.FILE
      };
    } catch(err) {
      return {
        path: file,
        type: 'unknown',
        error: err.stack
      };
    }
  });
};