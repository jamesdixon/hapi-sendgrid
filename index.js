var Hoek = require('hoek'),
    Joi = require('joi'),
    HapiSendGridClient = require('./client'),
    Promise = require('bluebird');

var internals = {
  defaults: {
    clientOptions: {},
    emailOptions: {}
  }
};

internals.schema = Joi.object({
    username: Joi.string(),
    password: Joi.string(),
    apiKey: Joi.string(),
    clientOptions: Joi.object(),
    emailOptions: Joi.object(),
  })
  .min(1)
  .and('username', 'password')
  .without('apiKey', ['username', 'password']);

exports.register = function(server, options, next) {
  var sendgrid,
    settings = Hoek.applyToDefaults(internals.defaults, options);

  Joi.assert(settings, internals.schema, 'Invalid hapi-sendgrid configuration. Must specify either a SendGrid API Key OR a SendGrid username/password.');

  if (settings.apiKey) {
    sendgrid = require('sendgrid')(settings.apiKey, settings.clientOptions);
  } else {
    sendgrid = require('sendgrid')(settings.username, settings.password, settings.clientOptions);
  }

  // expose the sendgrid client
  server.expose('client', new HapiSendGridClient(Promise.promisifyAll(sendgrid), settings.emailOptions));

  next();
}

exports.register.attributes = {
  pkg: require('./package.json')
};
