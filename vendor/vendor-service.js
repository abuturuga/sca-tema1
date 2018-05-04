const HashChain        = require('../shared/hash-chain'),
      PaywordComponent = require('../shared/payword-component');


class Vendor extends PaywordComponent {

  constructor(config) {
    super(config);
    this.users = {};
  }

  /**
   * @param {Object} Broker certificate
   * @returns {Boolean}
   */
  setBrokerCertificate(certificate) {
    return this.registerCertificate('broker', certificate, 'bankPublicKey')
  }

  /**
   * Validate if the user commit is valid
   * @param {Object} commit User commit
   * @returns {Boolean}
   */
  isValidCommit(commit) {
     const { userPublicKey } = commit.paywordCertificate;

     return this.isValid(commit, userPublicKey);
  }

  addCommit(commit) {
    if(this.isValidCommit(commit)) {
      const { paywordCertificate } = commit,
            { userId, info } = paywordCertificate;

      this.userCommit = commit;
      return true;
    }

    return false;
  }

  addPayment(pay) {
    const { c0, chainSize } = this.userCommit,
          { index, hash } = pay;

    if(HashChain.validate(c0, hash, index)) {
      this.lastIndex = index;
      this.lastHash = hash;
      return true;
    }

    return false;
  }

}

module.exports = Vendor;
