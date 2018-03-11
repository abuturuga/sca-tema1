const Socket = require('net').Socket;

class ClientSocket {

  constructor({ address, port, target }) {
    this.config = { address, port };
    this.target = target;
    this.socket = new Socket();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket.connect(this.config, () => {
        console.log('init connection to client' + this.target);
        resolve();
      });
    })
  }

  send(payload) {
    this.socket.write(JSON.stringify(payload), 'utf8', (err) => {
      console.log(err);
    });
  }

  onData(callback) {
    this.socket.on('data', payload => {
      callback(JSON.parse(payload));
    });
  }

  _bindEvents() {
    this.socket.on('connected', function(data) {
      console.log('connected ' + data);
    });

    this.socket.on('error', function(error) {
      console.log(error);
    });
  }

}

module.exports = ClientSocket;
