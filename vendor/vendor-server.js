const SocketServer      = require('../socket/server'),
      SocketClient      = require('../socket/client'),
      VendorService     = require('./vendor-service'),
      config            = require('../config'),
      readline         = require('readline'),
      actions           = require('../shared/actions');

class VendorServer {

  constructor(config, broker) {
    this.server = new SocketServer(config);
    this.brokerSocket = new SocketClient(broker);
    this.server.start();

    this.service = new VendorService(config);
  }

  handleData(data, socket) {
    switch (data.type) {
      case actions.SEND_COMMIT: {
        const paywordCertificate = this.service.registerClient(data.payload, USER_CLIENT);
        socket.write(JSON.stringify({
          type: actions.SEND_USER_PAYWORD_CERTIFICATE,
          payload: paywordCertificate
        }));
        break;
      }
    }
  }

  listen() {
    this.server.onClientConnect(socket => {
      socket.on('data', payload => {
        this.handleData(JSON.parse(payload), socket);
      });
    });
  }

  /**
   * Send the registration credentials to the broker
   * @param  {Object} credentials
   * @return {Promise}
   */
  sendRegistration(credentials) {
    return new Promise((resolve, reject) => {
      this.brokerSocket.send({type: actions.REGISTER_VENDOR, payload: credentials})
        .onData(({type, payload}) => {
          if(actions.SEND_VENDOR_CERTIFICATE) {
            resolve(payload);
          }
        });
    });
  }

  async registerToBroker() {
    try {
      await this.brokerSocket.connect();
      const credentials = this.service.getRegisterCredentials(),
            certificate = await this.sendRegistration(credentials);

      const hasSet = this.service.setBrokerCertificate(certificate);
      if (hasSet) {
        console.log('Vendor is registred to broker');
      } else {
        console.log('Vendor certificate is invalid');
      }
    } catch(error) {
      console.log(error);
      return error;
    }
  }

}

const server = new VendorServer(config.vendor, config.broker);
server.listen();

rl = readline.createInterface(process.stdin, process.stdout);
rl.on('line', line => {
  switch (line.trim()) {
    case 'register_broker':
      server.registerToBroker();
      break;
    default:
      console.log('This command is unknown');
  }
});

const prefix = 'Command> ';
rl.setPrompt(prefix, prefix.length);
rl.prompt();