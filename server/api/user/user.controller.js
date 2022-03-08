'use strict';

require("../../components/extensions");
var User = require('./user.model');
var Group = require('../group/group.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var sendgrid  = require('sendgrid')(config.sendgrid.apikey);
var _ = require('lodash');

var validationError = function(res, err) {
  return res.json(422, err);
};

function checkAdmin(user, cb) { // I hate this
    return user.hasRole('Administrators', function(err, isAdmin) {
        cb(err, isAdmin);
    });
};

/**
 * Get list of users
 */
exports.index = function(req, res) {

    console.log("req.user is", req.user);
    checkAdmin(req.user, function returnIndex(err, isAdmin) {
        if (isAdmin) {
            User.find({}).select('-salt -hashedPassword').sort({lastName: 1 })
		.exec(function (err, users) {
                if(err) return res.send(500, err);
                res.json(200, users);
            });
        } else {
            User.find({'Membership level': 'Active'})
                .select({
                    firstName: 1,
                    lastName: 1,
                    'Instrument 1': 1,
                    City: 1,
                    'Group participation': 1,
                })
		.sort({ 'Instrument 1': 1 })
                .exec(function (err, users) {
                    if(err) return res.send(500, err);
                    res.json(200, users);
                });
        };
    })
};


// Creates a new user in the DB.
exports.create = function(req, res) {
  req.body.provider = 'local';
  User.create(req.body, function(err, user) {
    if(err) { return handleError(res, err); }
    return res.json(201, user);
  });
};

/**
 * Creates a new user
 */
exports.register = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.firstName = req.body.firstName;
  newUser.lastName = req.body.lastName;
  Group.findOne({ name: 'Users' }, function(err, g) {
    newUser.groups.push(g);

    newUser.save(function(err, user) {
      if (err) return validationError(res, err);
      var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
      res.json({ token: token });
    });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.adminData);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Reset a user's password
 */
exports.resetPassword = function(req, res, next) {
    var userId = req.params.id;
    var newPass = Math.floor(Math.random() * 999999999999).toString(36);
    User.findById(userId, function (err, user) {
        user.password = newPass;
        user.save(function(err) {
            var emailMessage = new sendgrid.Email({
                to: user.email,
                from:     config.sendgrid.fromEmail,
                fromname:     config.sendgrid.fromName,
                subject:  "Password reset for MD Community Band",
                text: 'Your password for logging in to ' +
                    'https://members.marylandcommunityband.org has been ' +
                    'reset. Please log in using the password below, then change it to a new password of your own choosing.\n\n    ' + newPass,
            });

            console.log("calling sendgrid");
            sendgrid.send(emailMessage, function(err, json) {
                console.log("sendgrid called");
                if (err) {
                    console.log("Error sending password update: ", err);
                }
            });
            if (err) return validationError(res, err);
            res.send(200);
        });
    });
};

exports.sendNewPasswords = function(req, res, next) {
    console.log("This is sendNewPasswords");
    User.find({'hashedPassword': { '$eq' : '' }}, function(err, doc) {
        
        console.dir(doc);
    });
    res.send(200);
};

/**
 * Updates profile information
 */
exports.updateProfile = function(req, res, next) {
  var userId = req.user._id;
  var firstName = String(req.body.firstName);
  var lastName = String(req.body.lastName);

  User.findById(userId, function (err, user) {
    user.firstName = firstName;
    user.lastName = lastName;
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.send(200);
    });
  });
};

/**
 * Updates profile information
 */
exports.update = function(req, res, next) {
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    var updated = _.merge(user, req.body);
    updated.groups = [];
    _.each(req.body.groups, function (g) {
      updated.groups.push(g);
    });
    
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, user);
    });
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword').populate('groups').exec(function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);

    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

function handleError(res, err) {
  return res.send(500, err);
}
