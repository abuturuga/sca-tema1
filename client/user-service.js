const SignService  = require('../shared/sign'),
      KeyGenerator = require('../shared/keys-generator'),
      HashChain    = require('../shared/hash-chain');


class UserService {

  constructor() {
    this.keys = KeyGenerator();
    this.hashChain = [];
    this.lastPay = 0;
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

  /**
   * Genereate a new hash chain based on the half of the 
   * amount of available money
   */
  generateHashChain() {
    const { creditLimit } = this.paywordCertificate.info;
    this.chainSize = creditLimit / 2;
    this.hashChain = HashChain.generate(this.chainSize);
  }

  /**
   * Validate the payword certificate recevied from the bank
   * @param {Object} certificate Payword certificate
   */
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

  /**
   * Build a new commit for the vendor
   * @returns {Object} User commit
   */
  buildCommit() {
    const commit = {
      vendorId: 0,
      certificate: this.paywordCertificate,
      c0: this.hashChain[0],
      date: (new Date).toISOString(),
      chainSize: this.chainSize
    };

    const { privateKey } = this.keys;
    commit.signature = SignService.sign(commit.toString(), privateKey);
    return commit;
  }

  pay(amount) {
    if(amount >= this.chainSize - 1 || amount <= 0) {
      return null;
    }
    const index = this.lastPay + amount;

    if(index >= this.chainSize - 1) {
      return null;
    }

    return {
      index,
      hash: this.hashChain[index]
    }
  }

}

module.exports = UserService;
