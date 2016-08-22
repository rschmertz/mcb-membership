'use strict';

var mongoose = require('mongoose');
var Group = require('../group/group.model');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var _ = require('lodash');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, lowercase: true },
  'Cell Phone': String,
    'Instrument 1': String,
    'Instrument 2': String,
    'Instrument 3': String,
    'Street Address 1': String,
    'Street Address 2': String,
    City: String,
    State: String,
    Zip: String,
    'Home Phone': String,
    'Work Phone': String,
    'MD Alumni': String,
    'Faculty/Staff':String,
    'Semester/Year Joined': String,
    Ext: String,
    'Group participation': String,
    'Membership level': String,
  hashedPassword: String,
  provider: String,
  salt: String,
  google: {},
  github: {},
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'firstName': this.firstName,
      'lastName': this.lastName,
      email: this.email,
        phoneNumber: this['Cell Phone'],
        instrument: this['Instrument 1'],
      groups: this.groups
    };
  });

UserSchema
  .virtual('adminData')
  .get(function() {
      var slimUser = _.omit(this.toObject(), ["hashedPassword", "salt", "__v"]);
      return slimUser;
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  hasRole: function (roleRequired, cb) {
      var thisUser = this;
      Group.findOne({ name: roleRequired}, function(err, role) {
          if (err) {
              console.log("err!");
              return cb (err);
          }
          var _hasRole = _.some(thisUser.groups, function(g) {
              var h = role._id.toString();
              return (g == h);
          });
          return cb(null, _hasRole);
      });
  }
};

module.exports = mongoose.model('User', UserSchema);
