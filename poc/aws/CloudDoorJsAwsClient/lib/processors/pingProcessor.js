'use strict';

module.exports = (pushNotificationService, data) => {
  pushNotificationService.publish(data.target, {
    ping: 'pong'
  });
};