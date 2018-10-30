'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.delete('/:id', auth.hasRole('Administrators'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/:id/password', auth.hasRole('Administrators'), controller.resetPassword);
router.post('/sendNewPasswords', auth.hasRole('Administrators'), controller.sendNewPasswords);
router.put('/:id/profile', auth.isAuthenticated(), controller.updateProfile);
router.put('/:id', auth.hasRole('Administrators'), controller.update);
router.get('/:id', auth.hasRole('Administrators'), controller.show);
router.post('/', auth.hasRole('Administrators'), controller.create);
router.post('/register', controller.register);

module.exports = router;
