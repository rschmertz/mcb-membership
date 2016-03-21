'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationLogSchema = new Schema({
  type: String,
  time: { type : Date, default: Date.now },
  subject: String,
  message: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
});

module.exports = mongoose.model('NotificationLog', NotificationLogSchema);