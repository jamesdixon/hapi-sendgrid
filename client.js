var Hoek = require('hoek');

(function(root, factory) {

  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory(); // Export if used as a module
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    exports.hapiSendGrid = factory();
  } else {
    root.hapiSendGrid = factory();
  }

})(this, function() {
  var Client = function(sendGridClient, defaultEmailOptions) {
    this.sendGridClient = sendGridClient;
    this.defaultEmailOptions = defaultEmailOptions;
  };

  Client.prototype.send = function(email) {
    var newEmail = Hoek.applyToDefaults(email, this.defaultEmailOptions);
    return this.sendGridClient.sendAsync(newEmail);
  };

  // expose the interface
  return Client;
});
