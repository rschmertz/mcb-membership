'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PermissionSchema = new Schema({
  name: String,
  description: String,
  active: Boolean
});

module.exports = mongoose.model('Permission', PermissionSchema);