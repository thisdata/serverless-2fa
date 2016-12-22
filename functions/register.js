'use strict';

var crypto = require('crypto');
var base32 = require('thirty-two');

var User = require('../models/user');
var helpers = require('../helpers');

module.exports.handler = (event, context, callback) => {

console.log('REGISTER USER');

  var body = JSON.parse(event.body)

  var apiKey = 'blah';
  var customerId = 'customer1';
  var userId = body.userId;


  // Check if the user is already registered
  User.getAsync(customerId, userId).then(function(user){

    if(user)
      return user;

    // No user found so lets register them
    var key = crypto.randomBytes(20).toString('hex');

    return User.createAsync({
        customerId: customerId,
        userId: userId,
        secretKey: helpers.encryptText(key, apiKey)
    });


  }).then(function(user){

console.log("DO THE KEY PART")

console.log(user);

    var secretKey = user.get("secretKey");

console.log("SK: " + secretKey);


    var key = helpers.decryptText(secretKey, apiKey);

console.log("Key: " + key);

    // encoded will be the secret key, base32 encoded
    var encoded = base32.encode(key);

    // Google authenticator doesn't like equal signs
    var encodedForGoogle = encoded.toString().replace(/=/g,'');

    // to create a URI for a qr code (change totp to hotp if using hotp)
    var uri = 'otpauth://totp/somelabel?secret=' + encodedForGoogle;

    var response = JSON.stringify({
      userId: userId,
      qrCode: 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + uri
    });

    callback(null, { statusCode: 200, body: response });


  }).error(function(e){

    console.log(e);
    callback(null, { statusCode: 500, body: e });

  });

};
