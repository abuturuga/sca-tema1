const HashChain        = require('../shared/hash-chain'),
      PaywordComponent = require('../shared/payword-component');


class UserService extends PaywordComponent {

  constructor(config) {
    super(config);

    this.hashChain = [];
    this.lastPay = 0;
  }

  /**
   * Genereate a new hash chain based on the half of the
   * amount of available money
   */
  generateHashChain() {
    const { creditLimit } = this.certificates['payword'].info;
    this.chainSize = creditLimit / 2;
    this.hashChain = HashChain.generate(this.chainSize);
  }

  /**
   * Verifiy and set the payword certificate emited by the bank
   * @param {object} paywordCertificate Broker payword certificate
   */
  setPaywordCertificate(paywordCertificate) {
    if (this.registerCertificate('payword', paywordCertificate, 'bankPublicKey')) {
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
      paywordCertificate: this.certificates['payword'],
      c0: this.hashChain[0],
      date: (new Date).toISOString(),
      chainSize: this.chainSize
    };

    return this.sign(commit);
  }

  /**
   * Build a pay object for the vendor
   * @param {Number} amount Money to send
   */
  pay(amount) {
    if(amount >= this.chainSize - 1 || amount <= 0) {
      return null;
    }
    const index = this.lastPay + amount;

    if(index >= this.chainSize - 1) {
      return null;
    }

    return {
      userId: this.id,
      userIp: this.ip,
      index,
      hash: this.hashChain[index]
    }
  }

}

module.exports = UserService;
