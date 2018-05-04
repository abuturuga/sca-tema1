const SocketClient     = require('../socket/client'),
      UserService      = require('./user-service'),
      config           = require('../config'),
      actions          = require('../shared/actions'),
      readline         = require('readline');

const prefix = 'User:: ';

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
          if(actions.SEND_USER_PAYWORD_CERTIFICATE === type) {
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
    const commit = this.service.buildCommit();
    await this.vendorSocket.connect();
    this.vendorSocket.send({type: actions.SEND_COMMIT, payload: commit})
      .onData(({type}) => {
        if (type === actions.OPERATION_SUCCEED) {
          console.log(`${prefix} commit is ok`);
        }
      });
  }

}

const client = new UserClient(config.vendor, config.broker);
rl = readline.createInterface(process.stdin, process.stdout);
rl.on('line', line => {
  const args = line.trim().split(':');
  switch (args[0]) {
    case 'register_broker':
      client.registerToBroker();
      break;
    case 'register_vendor':
      clinet.registerToVendor();
      break;
    case 'send_commit':
      client.sendCommit();
      break;
    case 'pay':
      client.pay(parseInt(args[1]));
      break;
    default:
      console.log('This command is unknown');
  }
});


rl.setPrompt(prefix, prefix.length);
rl.prompt();