const Server = require('../socket/server'),
      config = require('../config');

const server = new Server(config.vendor);
server.start();

server.onData(function(data) {
  console.log(data);
});
