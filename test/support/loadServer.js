var Hapi = require('hapi');
var HapiSendGrid = require('../../index');

module.exports = function(options, cb) {
  var server = new Hapi.Server();
  server.connection();

  server.register(options, function(err) {
    return cb(err, server);
  });
};
