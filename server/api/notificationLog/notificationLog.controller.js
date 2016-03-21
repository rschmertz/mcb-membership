'use strict';

var _ = require('lodash');
var NotificationLog = require('./notificationLog.model');

// Get list of notificationLogs
exports.index = function(req, res) {
  NotificationLog.find().sort('-time').exec(function (err, notificationLogs) {
    if(err) { return handleError(res, err); }
    return res.json(200, notificationLogs);
  });
};

// Get a single notificationLog
exports.show = function(req, res) {
  NotificationLog.findById(req.params.id, function (err, notificationLog) {
    if(err) { return handleError(res, err); }
    if(!notificationLog) { return res.send(404); }
    return res.json(notificationLog);
  });
};

// Creates a new notificationLog in the DB.
exports.create = function(req, res) {
  NotificationLog.create(req.body, function(err, notificationLog) {
    if(err) { return handleError(res, err); }
    return res.json(201, notificationLog);
  });
};

// Updates an existing notificationLog in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  NotificationLog.findById(req.params.id, function (err, notificationLog) {
    if (err) { return handleError(res, err); }
    if(!notificationLog) { return res.send(404); }
    var updated = _.merge(notificationLog, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, notificationLog);
    });
  });
};

// Deletes a notificationLog from the DB.
exports.destroy = function(req, res) {
  NotificationLog.findById(req.params.id, function (err, notificationLog) {
    if(err) { return handleError(res, err); }
    if(!notificationLog) { return res.send(404); }
    notificationLog.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}