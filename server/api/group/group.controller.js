'use strict';

var _ = require('lodash');
var async = require('async');
var Group = require('./group.model');
var User = require('../user/user.model');

function updateUsers(group, users, callback) {
  var groupUsers;
  
  async.parallel([
    function(cb) {
      User.find({ groups: { $in: [group._id] }}, function(err, dbUsers) {
        cb(null, dbUsers);
      });
    },

    function(cb) {
      User.find({ _id: { $in: users }}, function(err, dbUsers) {
        cb(null, dbUsers);
      });
    }
    ],

    function(err, results) {
      var allUsers = _.union(results[0], results[1]);
      for (var index in allUsers) {
        var user = allUsers[index];
        if (!_.contains(users, user._id.toString())) {
          user.groups.remove(group._id);
        } else if (!_.contains(user.groups, group._id.toString())){

          user.groups.push(group._id);
        }

        user.save();
      }

      callback();
    });
}

// Get list of groups
exports.index = function(req, res) {
  Group.find(function (err, groups) {
    if(err) { return handleError(res, err); }
    return res.json(200, groups);
  });
};

// Get a single group
exports.show = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }

    group = group.toJSON();
    group.users = [];

    User.find({ groups: { $in: [group._id] }}, function(err, users) {
      group.users = _.map(users, function(u) {
        return u._id;
      });

      return res.json(group);  
    });
  });
};

// Creates a new group in the DB.
exports.create = function(req, res) {
  Group.create(req.body, function(err, group) {
    if(err) { return handleError(res, err); }

    User.find({ _id: { $in: req.body.users }}, function(err, users) {
      _.each(users, function(u) {
        u.groups.push(group._id);
        u.save();
      });

      return res.json(201, group);  
    });
  });
};

// Updates an existing group in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    var updated = _.merge(group, req.body);
    updated.permissions = [];
    _.each(req.body.permissions, function (g) {
      updated.permissions.push(g);
    });
    updated.save(function (err) {
      if (err) { return handleError(res, err); }

      updateUsers(group, req.body.users, function() {
        return res.json(200, group);  
      });        
    });
  });
};

// Deletes a group from the DB.
exports.destroy = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}