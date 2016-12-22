'use strict';

var crypto = require('crypto');

const ALGORITHM = 'aes-256-ctr';

function encryptText(text, secret){
  var cipher = crypto.createCipher(ALGORITHM, secret)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decryptText(text, secret){
  var decipher = crypto.createDecipher(ALGORITHM, secret)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = {
  encryptText: encryptText,
  decryptText: decryptText
}