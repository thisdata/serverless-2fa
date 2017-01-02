'use strict';

var AWS = require('aws-sdk');

module.exports.handler = (event, context) => {

console.log(event);

  var token = event.authorizationToken;

  if (token == 'xx'){

    var customerId = '1234';

    var policy = generatePolicy(event.methodArn, customerId);

console.log(policy);

    context.succeed(policy);
  }else{
    context.fail('Not Authorized');
  }

};

function generatePolicy(methodArn, customerId)
{
  methodArn = methodArn.split('/');
  var baseArn = methodArn[0] + '/' + methodArn[1];

  var policy = {
    "principalId": customerId,
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "execute-api:Invoke"
          ],
          "Resource": [
            baseArn + "/POST/validate",
            baseArn + "/POST/register"
          ]
        }
      ]
    }
  };

  return policy;
}