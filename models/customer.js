'use strict';

var vogels = require('vogels');
var Joi    = require('joi');
var Promise = require("bluebird");

vogels.AWS.config.update({region: process.env.REGION});

var Customer = vogels.define('Customer', {
  hashKey : 'customerId',
  rangeKey : 'name',
  timestamps : true,
  schema : {
    customerId : Joi.string().required().trim(),
    name : Joi.string().required()
  },
  tableName: process.env.CUSTOMERS_TABLE_NAME
});

module.exports = Promise.promisifyAll(Customer);