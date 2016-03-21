'use strict';

var express = require('express');
var controller = require('./permission.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('Administrators'), controller.index);
router.get('/:id', auth.hasRole('Administrators'), controller.show);
router.post('/', auth.hasRole('Administrators'), controller.create);
router.put('/:id', auth.hasRole('Administrators'), controller.update);
router.patch('/:id', auth.hasRole('Administrators'), controller.update);
router.delete('/:id', auth.hasRole('Administrators'), controller.destroy);

module.exports = router;