const SignService  = require('./sign-service'),
      KeyGenerator = require('./keys-generator');


class PaywordComponent {

  constructor(config) {
    this.ip = `${config.address}:${config.port}`;
    this.id = config.id;

    this.keys = KeyGenerator();
    this.certificates = {};
  }

  /**
   * Sign a message with private key
   * @param  {Object} data       [Object message]
   * @param  {String} privateKey [RSA private key]
   * @returns {Object}           [Sign message]
   */
  sign(data) {
    const message = Object.assign({}, data);
    message.signature = SignService.sign(JSON.stringify(data), this.keys.privateKey);
    return message;
  }

  /**
   * Check if the signature of a message is valid
   * @param   {Object}  message   [Object]
   * @param   {String}  publicKey [RSA public key]
   * @returns {Boolean}
   */
  isValid(message, publicKey) {
    const messageCopy = Object.assign({}, message),
          { signature } = message;

    delete messageCopy.signature;
    return SignService.verify(publicKey, signature, JSON.stringify(messageCopy));
  }

  getRegisterCredentials() {
    return Object.assign(
      {},
      this.credentials,
      {
        ip: this.ip,
        id: this.id,
        publicKey: this.keys.publicKey
      }
    );
  }

  /**
   * Register a new certificate.
   * @param  {string} name              [description]
   * @param  {Object} certificate       [description]
   * @param  {String} [key='publicKey'] [description]
   * @return {boolean}                  [description]
   */
  registerCertificate(name, certificate, key = 'publicKey') {
    const publicKey = certificate[key];

    if (this.isValid(certificate, publicKey)) {
      this.certificates[name] = certificate;
      return true;
    }

    return false;
  }

}

module.exports = PaywordComponent;
