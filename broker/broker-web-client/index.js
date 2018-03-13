const express = require('express'),
      fs      = require('fs'),
      path    = require('path'),
      config  = require('../../config');

const app = express();

const server = new BrokerServer(config.broker);
server.listen();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/broker-template.html'));
});

app.listen(8080);