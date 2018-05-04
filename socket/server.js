const net = require('net');

/**
 * Wrap over a simple tcp server from net module.
 */
class SocketServer {

  /**
   * Get the server config
   * @param {Number} port     Server port
   * @param {String} address  Server address
   * @param {String} name     Server name
   */
  constructor({ port, address, id }) {
    this.config = { port , address };
    this.name = id;

    this.server = null;
    this.socket = null;
  }

  /**
   * Instantiate and start the server
   */
  start() {
    this.server = net.createServer((socket) => {
      socket.setEncoding('utf8');

      socket.on('error', (error) => {
        console.log(error);
      });

      this._onClientConnect(socket);
    });

    this._listen();
  }

  /**
   * Set a callback to recieve data from the socket.
   * It will be called each when a data event is triggered on the socket.
   * @param  {Function} callback
   */
  onData(callback) {
    this._onDataCallback = callback;
  }

  onClientConnect(callback) {
    this._onClientConnect = callback;
  }

  /**
   * Start to listen.
   */
  _listen() {
    this.server.listen(this.config, () => {
      console.log(`Socket Server ${this.name} up on port: ${this.config.port}`);
    });
  }
}

module.exports = SocketServer;
