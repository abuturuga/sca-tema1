const SignService  = require('../shared/sign'),
      KeyGenerator = require('../shared/keys-generator'),
      HashChain    = require('../shared/hash-chain');


class UserService {

  constructor() {
    this.keys = KeyGenerator();
    this.hashChain = [];
    this.credentials = {
      id: 'user1',
      password: 'pass'
    };

    this.paywordCertificate = null;
  }

  /**
   * Create an user credentials object in order to register on the broker.
   * @return {Object}
   */
  createUserRegistration() {
    const { publicKey } = this.keys;
    return Object.assign({}, this.credentials, { publicKey });
  }

  
  generateHashChain() {
    const { creditLimit } = this.paywordCertificate;
    this.chainSize = creditLimit / 2;
    this.hashChain = HashChain.generate(this.chainSize);
  }

  isValidCertificate(certificate) {
    const { bankPublicKey, signature } = certificate,
          certCopy = Object.assign({}, certificate);
    
    return SignService.verify(bankPublicKey, signature, certCopy.toString());
  }

  /**
   * Verifiy and set the payword certificate emited by the bank
   * @param {object} paywordCertificate Broker payword certificate
   */
  setPaywordCertificate(paywordCertificate) {
    if(this.isValidCertificate(paywordCertificate)) {
      this.paywordCertificate = paywordCertificate;
      this.generateHashChain();

      return true;
    }

    return false;
  }

  commit() {
    return {
      vendorId: 0,
      certificate: this.paywordCertificate,
      c0: this.hashChain[0],
      date: (new Date).toISOString(),
      chainSize: this.chainSize
    }
  }

}

module.exports = UserService;
