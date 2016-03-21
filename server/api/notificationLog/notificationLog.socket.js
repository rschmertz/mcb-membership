/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var NotificationLog = require('./notificationLog.model');

exports.register = function(socket) {
  NotificationLog.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  NotificationLog.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('notificationLog:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('notificationLog:remove', doc);
}