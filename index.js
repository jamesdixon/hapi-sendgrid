var Hoek = require('hoek'),
    Joi = require('joi');

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
    emailOptions: Joi.object({
      smtpapi: Joi.func(),
      to: Joi.array().items(Joi.string().email()),
      toname: Joi.array().items(Joi.string()),
      from: Joi.string().email(),
      fromname: Joi.string(),
      subject: Joi.string(),
      text: Joi.string(),
      html: Joi.string(),
      bcc: Joi.array().items(Joi.string().email()),
      cc: Joi.array().items(Joi.string().email()),
      replyto: Joi.string().email(),
      date: Joi.date(),
      files: Joi.array().items(Joi.object({
        filename: Joi.string(),
        contentType: Joi.string(),
        cid: Joi.string(),
        path: Joi.string(),
        url: Joi.string(),
        content: Joi.string() || Joi.type(Buffer, 'Buffer')
      })
      .and('filename', 'content')
    ),
      file_data: Joi.object(),
      headers: Joi.object()
    })
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

  // exposes the sendgrid client to the server
  server.expose('client', sendgrid);

  next();
}

exports.register.attributes = {
  pkg: require('./package.json')
};
