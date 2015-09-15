var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var HapiSendGrid = require('../');
var nock = require('nock');
var loadServer = require('./support/loadServer');

// bdd shortcuts
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;


describe('Client', function() {
  var sendGridServer;

  beforeEach(function(done) {
    // mock the sendgrid server
    sendGridServer = nock('https://api.sendgrid.com')
      .post('/api/mail.send.json')
      .reply(200,
        JSON.stringify({
          message: 'success'
        })
      );
    done();
  });

  afterEach(function(done) {
    nock.cleanAll();
    done();
  });

  it('should load the plugin', function(done) {

    var pluginConf = {
      register: HapiSendGrid,
      options: {
        apiKey: 'test'
      }
    };

    loadServer(pluginConf, function(err, server) {
      if (err) {
        return done(error);
      }

      expect(server).to.exist();
      expect(server.plugins['hapi-sendgrid']).to.exist();
      expect(server.plugins['hapi-sendgrid'].client).to.exist();
      done();
    });
  });

  it('should send an email when paramaters are specified', function(done) {
    var pluginConf = {
      register: HapiSendGrid,
      options: {
        apiKey: 'test'
      }
    };

    loadServer(pluginConf, function(err, server) {
      if (err) {
        return done(error);
      }

      var client = server.plugins['hapi-sendgrid'].client;

      var email = new client.sendGridClient.Email({
        to: 'biggie@yahoo.com',
        from: 'mase@yahoo.com',
        subject: 'whatup playa',
        text: 'word'
      });

      client.send(email).then(function(result) {
        expect(result).to.not.be.empty();
        return done();
      }).catch(function(err) {
        return done(err);
      });
    });
  });

  it('should use default options when a parameter is not specified', function(done) {
    var pluginConf = {
      register: HapiSendGrid,
      options: {
        apiKey: 'test',
        emailOptions: {
          to: '2pac@thug.org'
        }
      }
    };

    loadServer(pluginConf, function(err, server) {
      if (err) {
        return done(error);
      }

      var client = server.plugins['hapi-sendgrid'].client;

      // 'to:' is specified by default options
      var email = new client.sendGridClient.Email({
        from: 'mase@yahoo.com',
        subject: 'whatup playa',
        text: 'word'
      });

      client.send(email).then(function(result) {
        expect(result).to.not.be.empty();
        return done();
      }).catch(function(err) {
        return done(err);
      });
    });

  });

});
