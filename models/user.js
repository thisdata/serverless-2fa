'use strict';

var vogels = require('vogels');
var Joi    = require('joi');
var Promise = require("bluebird");

vogels.AWS.config.update({region: process.env.REGION});

var User = vogels.define('User', {
  hashKey : 'customerId',
  rangeKey : 'userId',
  timestamps : true,
  schema : {
    customerId : Joi.string().required().trim(),
    userId : Joi.string().required().trim(),
    secretKey: Joi.string(),
    phone: Joi.string().regex(/^\+?[1-9]\d{1,14}$/),
    otp: Joi.number().integer(),
    otpExpiresAt: Joi.date().timestamp('unix')
  },
  tableName: process.env.USERS_TABLE_NAME
});

module.exports = Promise.promisifyAll(User);