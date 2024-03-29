'use strict';

var crypto = require('crypto');
var base32 = require('thirty-two');

var User = require('../models/user');
var helpers = require('../helpers');

module.exports.handler = (event, context, callback) => {

  var body = JSON.parse(event.body)
  var apiKey = 'blah';
  var userId = body.userId;


  // Check if the user is already registered
  User.getAsync(userId).then(function(user){

    if(user)
      return user;

    // No user found so lets register them
    var key = crypto.randomBytes(20).toString('hex');

    return User.createAsync({
        userId: userId,
        name: body.name,
        secretKey: helpers.encryptText(key, apiKey)
    });

  })
  .then(function(user){

    var secretKey = user.get("secretKey");
    var key = helpers.decryptText(secretKey, apiKey);

    // encoded will be the secret key, base32 encoded
    var encoded = base32.encode(key);

    // Google authenticator doesn't like equal signs
    var encodedForGoogle = encoded.toString().replace(/=/g,'');

    // to create a URI for a qr code (change totp to hotp if using hotp)
    var uri = 'otpauth://totp/' + process.env.SERVICE_NAME + '?secret=' + encodedForGoogle;

    var response = JSON.stringify({
      userId: userId,
      qrCode: 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + uri
    });

    callback(null, { statusCode: 200, body: response });

  })
  .error(function(e){

    callback(null, { statusCode: 500, body: JSON.stringify(e) });

  });

};
