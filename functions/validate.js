'use strict';

var crypto = require('crypto');
var notp = require('notp');
var base32 = require('thirty-two');

var User = require('../models/user');
var helpers = require('../helpers');

module.exports.handler = (event, context, callback) => {


console.log(event);

  var body = JSON.parse(event.body)

  var apiKey = 'blah';
  var customerId = 'customer1';
  var userId = body.userId;
  var token = body.token;

  // Check if the user is already registered
  User.getAsync(customerId, userId).then(function(user){

    var secretKey = user.get('secretKey');
    var key = helpers.decryptText(secretKey, apiKey);

    var tokenStatus = notp.totp.verify(token, key);

    var valid = tokenStatus != null

    var response = JSON.stringify({
      userId: userId,
      token: token,
      valid: valid
    });

    callback(null, { statusCode: 200, body: response });

  })
  .error(function(e){

    callback(null, { statusCode: 500, body: JSON.stringify(e) });

  });
};
