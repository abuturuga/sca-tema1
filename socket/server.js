const net = require('net');

class SocketServer {

  constructor({ port, address, name }) {
    this.config = { port , address };
    this.name = name;
    this.server = null;
    this.socket = null;
  }

  start() {
    this.server = net.createServer((socket) => {
      this._onClientConnect(socket);
    });

    this._listen();
  }

  onData(callback) {
    this._onDataCallback = callback;
  }

  _onClientConnect(socket) {
    socket.setEncoding('utf8');
    socket.on('error', (error) => {
      console.log(error);
    });

    socket.on('data', (data) => {
      this._onDataCallback(JSON.parse(data));
    });
  }

  _listen() {
    this.server.listen(this.config, () => {
      console.log(`Socket Server ${this.name} up on port: ${this.config.port}`);
    });
  }
}

module.exports = SocketServer;
