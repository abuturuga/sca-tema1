const SocketServer      = require('../socket/server'),
      SocketClient      = require('../socket/client'),
      VendorService     = require('./vendor-service'),
      config            = require('../config'),
      readline         = require('readline'),
      actions           = require('../shared/actions');

const prefix = 'Vendor:: ';

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
        const isValid = this.service.addCommit(data.payload);

        if (isValid) {
          console.log(`${prefix} commit is valid`);
          socket.write(JSON.stringify({
            type: actions.OPERATION_SUCCEED
          }));
        }
        break;
      }
      case actions.SEND_PAY: {
        const isValid = this.service.addPayment(data.payload);

        if (isValid === true) {
          console.log(`${prefix} payment is valid`);
          socket.write(JSON.stringify({
            type: actions.OPERATION_SUCCEED
          }));
        } else {
          console.log(`${prefix} payment is invalid: ${isValid}`);
        }
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

rl.setPrompt(prefix, prefix.length);
rl.prompt();