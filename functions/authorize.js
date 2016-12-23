'use strict';

var AWS = require('aws-sdk');

module.exports.handler = (event, context, callback) => {

console.log(event);

  var methodArn = event.methodArn.split('/');
  var baseArn = methodArn[0] + "/" + methodArn[1]

  var resources = [
    baseArn + "/POST/validate",
    baseArn + "/POST/register"
  ];

  var policy = {
    "principalId": "xxxxxxx", // Unique customer id
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "execute-api:Invoke"
          ],
          "Resource": resources
        }
      ]
    }
  };



console.log(policy);

  callback(null, policy);

  // try {

  //   // parse the ARN from the incoming event
  //   var apiOptions = {};
  //   var tmp = event.methodArn.split(':');
  //   var apiGatewayArnTmp = tmp[5].split('/');
  //   var awsAccountId = tmp[4];
  //   apiOptions.region = tmp[3];
  //   apiOptions.restApiId = apiGatewayArnTmp[0];
  //   apiOptions.stage = apiGatewayArnTmp[1];

  //   policy = new AuthPolicy(verifiedJwt.body.sub, awsAccountId, apiOptions);

  //   policy.allowMethod(AuthPolicy.HttpVerb.POST, "/register");
  //   policy.allowMethod(AuthPolicy.HttpVerb.POST, "/validate");

  //   context.succeed(policy.build());

  // } catch (ex) {
  //   console.log(ex, ex.stack);
  //   context.fail("Kapow! Denied....");
  // }


};