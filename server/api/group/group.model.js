'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  name: String,
  description: String,
  active: Boolean,
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
});

module.exports = mongoose.model('Group', GroupSchema);