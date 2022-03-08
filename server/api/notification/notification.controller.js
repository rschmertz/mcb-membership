'use strict';

var _ = require('lodash');
var async = require('async');
var NotificationLog = require('../notificationLog/notificationLog.model');
var User = require('../user/user.model');
var Group = require('../group/group.model');
var config = require('../../config/environment');
var sendgrid  = require('sendgrid')(config.sendgrid.apikey);
var twilio = require('twilio')(config.twilio.accountSid, config.twilio.authToken);



function sendEmail(model, users, cb) {
  var emails = _(users)
        .map('email')
        .filter(function (email) {
            //console.log("filtering on email " + email);
            // This is not what I meant to do but it works and I don't know why.
            return true;
        }).value();

    console.log("And in the end, final emails is " + emails);
  var emailMessage = new sendgrid.Email({
    to: [config.sendgrid.fromEmail],
    bcc:       emails,
    from:     config.sendgrid.fromEmail,
    fromname:     config.sendgrid.fromName,
    subject:  model.subject,
    text:     model.message,
    files:    model.files
  });

  sendgrid.send(emailMessage, function(err, json) {
    cb(err, emails.length);
  });
}

function sendSms(model, users, cb) {
  var numbers = _.filter(_.map(users, 'Cell Phone'));

  var threads = _.map(numbers, function(n) {
    return function(cb) {
      //Send an SMS text message
      twilio.sendMessage({
        to: n,
        from: config.twilio.from,
        body: model.subject 
      }, 
      function(err, responseData) {   
        return cb(err);
      });
    };
  });

  async.parallel(threads, function(errs) {
    cb(errs, numbers.length);
  });
}

function handleError(res, err) {
  console.log("Error: ");
  console.log(err);
  return res.send(500, err);
}

// Creates and send a new notification
exports.create = function(req, res) {
  var p = req.body;

  if (typeof p.users === 'string') {
    p.users = JSON.parse(p.users);
    p.groups = JSON.parse(p.groups);
  }

  p.files = [];
  if (req.files && req.files.file) {
    console.log('file ' + req.files.file.originalname + ' received');
    p.files.push({
      filename: req.files.file.originalname,
      content: req.files.file.buffer
    });
  }

  var query;
  if (p.mode === 'users') {
    query = { _id: { $in: p.users }};
  } else {
    query = { groups: { $in: p.groups }};
  }

  User.find(query, function(err, users) {
    var log = {
      users: p.users,
      groups: p.groups,
      subject: p.subject,
      message: p.message,
      type: p.type
    };

    var func = p.type === 'sms' ? sendSms : sendEmail;

    func(p, users, function(err, count) {
      if (err) { return handleError(res, err); }
      NotificationLog.create(log, function(err, notificationLog) {
        if (err) { return handleError(res, err); }
        return res.json(200, {success: true, count: count});
      });
    });
  });  
};
