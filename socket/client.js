const Socket = require('net').Socket;

class ClientSocket {

  constructor({ address, port, name }) {
    this.config = { address, port };
    this.target = name;
    this.socket = new Socket();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket.connect(this.config, () => {
        console.log(`init connection to the server: ${this.target}`);
        resolve();
      });
    })
  }

  send(payload) {
    this.socket.write(JSON.stringify(payload), 'utf8', (err) => {
      console.log(err);
    });

    return this;
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
