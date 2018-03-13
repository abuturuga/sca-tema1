const SignService      = require('../shared/sign'),
      KeyGenerator     = require('../shared/keys-generator');


class BrokerService {

  constructor({ name, address }) {
    this.keys = KeyGenerator();
    this.name = name;
    this.address = address;

    this.users = {};
    this.paywordCertificates = [];
  }

  /**
   * Build a new payword certificate based on the
   * user credentials.
   * @param  {Object} user  User credentials
   * @return {Object}       Payword certificate
   */
  buildPaywordCertificate(user) {
    const certificate = {
      userId: user.id,
      userIP: user.ip,
      bankId: this.name,
      bankPublicKey: this.keys.publicKey,
      userPublicKey: user.publicKey,
      exp: new Date('2018-04-04'),
      info: {
        card: '3123123123123123123',
        creditLimit: 200
      }
    };

    certificate.signature = SignService.sign(certificate.toString(), this.keys.privateKey);
    this.paywordCertificates.push(certificate);
    return certificate;
  }

  /**
   * Register a new user into the bank.
   * @param  {Object}   user User credentials
   * @return {Object}        User payword certificate
   */
  registerUser(user) {
    const { id, password, publicKey, ip } = user;
    if(this.users[id]) return;

    this.users[id] = {
      password,
      publicKey,
      ip
    };

    return this.buildPaywordCertificate(user);
  }



}

module.exports = BrokerService;
