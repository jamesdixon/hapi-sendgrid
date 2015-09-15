[![Build Status](https://travis-ci.org/jamesdixon/hapi-sendgrid.svg?branch=master)](https://travis-ci.org/jamesdixon/hapi-sendgrid)

# hapi-sendgrid
Hapi.js plugin that exposes the [SendGrid-nodejs](https://github.com/sendgrid/sendgrid-nodejs) library for sending emails through SendGrid.

## Installation

`npm install hapi-sendgrid --save`

## Usage
First, the `SendGrid-nodejs` requires authentication via either username/password OR an API key. When registering your plugin with Hapi, you must specify **only one** of the two. The accepted parameters are:

- `username`  and `password`
- `apiKey`

Here's a simple example:

```javascript
server.register({
    register: require('hapi-sendgrid'),
    options: {
        apiKey: 'myApiKey'
    }
 }, function (err) {

     if (err) {
         console.log('Failed loading plugin');
     }
 });
```

Once registered, you can access the plugin like so:

```javascript
var sendGridClient = server.plugins['hapi-sendgrid'].client;
```

Once you have the client, you may access all of the existing functionality of the [SendGrid-nodejs](https://github.com/sendgrid/sendgrid-nodejs) library.

## Setting Default Send options
In addition to exposing the `SendGrid-nodejs` client, the plugin also introduces the ability to set default options that can be used to avoid having to set email options, such as `from:`, over and over again. Passing in an `emailOptions` object to the plugin, will merge those options with any specific options you may set when sending an email. For example:

```javascript
server.register({
    register: require('hapi-sendgrid'),
    options: {
        apiKey: 'myApiKey',
        emailOptions: {
          from: '2pac@thug.org'
        }
    }
 }, function (err) {
   if (err) { console.log('Failed loading plugin'); }

   var client = server.plugins['hapi-sendgrid'].client;

   // 'to:' is specified by default options
   var email = new client.sendGridClient.Email({
     to: 'mase@yahoo.com',
     subject: 'whatup playa',
     text: 'word'
   });

   client.send(email).then(function(result) {
     console.log('SENT!');
     return done();
   }).catch(function(err) {
     console.error(err);
   });
});
```

In this example, setting the `from` property isn't necessary because the `from` property is inherited from the default `emailOptions`.

## Setting Client options
You may also change how the `SendGrid-nodejs` library behaves, such as changing the endpoint, by passing any of [the following options](https://github.com/sendgrid/sendgrid-nodejs#changing-url) into plugin using the `clientOptions` object. For example:


```javascript
server.register({
    register: require('hapi-sendgrid'),
    options: {
        apiKey: 'myApiKey',
        clientOptions: {
          protocol: "http",
          host: "sendgrid.org",
          endpoint: "/send",
          port: "80"
        }
    }
 }, function (err) {

     if (err) {
         console.log('Failed loading plugin');
     }
 });
```
