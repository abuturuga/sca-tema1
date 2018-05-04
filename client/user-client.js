const SocketClient     = require('../socket/client'),
      UserService      = require('./user-service'),
      config           = require('../config'),
      actions          = require('../shared/actions'),
      readline         = require('readline');


class UserClient {

  constructor(vendor, broker) {
    this.brokerSocket = new SocketClient(broker);
    this.vendorSocket = new SocketClient(vendor);
    this.service = new UserService(config.user);
  }

  /**
   * Send the registration credentials to the broker
   * @param  {Object} credentials
   * @return {Promise}
   */
  sendRegistration(credentials) {
    return new Promise((resolve, reject) => {
      this.brokerSocket.send({type: actions.REGISTER_USER, payload: credentials})
        .onData(({type, payload}) => {
          if(actions.SEND_USER_PAYWORD_CERTIFICATE) {
            this.service.setPaywordCertificate(payload);
            resolve(payload);
          }
        });
    });
  }

  /**
   * Register user to the broker
   * @return {Promise} [description]
   */
  async registerToBroker() {
    try {
      await this.brokerSocket.connect();
      const credentials = this.service.getRegisterCredentials(),
            certificate = await this.sendRegistration(credentials);

      const hasSet = this.service.setPaywordCertificate(certificate);
      if (hasSet) {
        console.log('User is registred to broker');
      } else {
        console.log('Payword certificate is invalid');
      }
    } catch(error) {
      console.log(error);
      return error;
    }
  }

  async sendCommit() {
    try {
      
    } catch(error) {
      console.log(error);
      return error;
    }
  }

}

const client = new UserClient(config.user, config.broker);
rl = readline.createInterface(process.stdin, process.stdout);
rl.on('line', line => {
  switch (line.trim()) {
    case 'register_broker':
      client.registerToBroker();
      break;
    case 'register_vendor':
      clinet.registerToVendor();
      break;
    default:
      console.log('This command is unknown');
  }
});

const prefix = 'Command> ';
rl.setPrompt(prefix, prefix.length);
rl.prompt();