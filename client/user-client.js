const SocketClient     = require('../socket/client'),
      UserService      = require('./user-service'),
      config           = require('../config'),
      actions          = require('../shared/actions');


class UserClient {

  constructor() {
    this.brokerSocket = new SocketClient(config.user);
    this.service = new UserService(config.user);
    this.vendorSocket = null;
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
      const credentials = this.service.createUserRegistration(),
            certificate = this.sendRegistration(credentials);

      return certificate;
    } catch(error) {
      console.log(error);
      return error;
    }
  }

}

module.exports = UserClient;
