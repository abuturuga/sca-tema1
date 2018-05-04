const HashChain        = require('../shared/hash-chain'),
      PaywordComponent = require('../shared/payword-component');


class Vendor extends PaywordComponent {

  constructor(config) {
    super(config);
    this.users = {};
    this.oneUser = null;
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
            { userId, userIp , info } = paywordCertificate;

      this.users[userId] = {
        lastIndex: 0,
        lastHash: null,
        commit
      }

      this.oneUser = userId;
      return true;
    }

    return false;
  }

  checkUserPay(pay) {
    if (!this.users[pay.userId]) {
      throw new Error(`This user id ${pay.userId} doen't have attach a commitement`);
    }

    const user = this.users[pay.userId],
          { c0, chainSize } = user.commit,
          { lastIndex } = user;

    if (chainSize <= pay.index) {
      throw new Error(`The payment index is bigger then the chain size`);
    } else if (lastIndex >= pay.index) {
      throw new Error(`The user send an index wich is lower or equal with a previous one`);
    } else if (HashChain.validate(c0, pay.hash, pay.index)) {
      throw new Error(`The hash chain for this index is corupted`);
    }

    return true;
  }

  addPayment(pay) {
    try {
      const { userId, index, hash } = pay;
      this.checkUserPay(pay);
      this.users[userId].lastIndex = index;
      this.users[userId].lastHash = hash;
      return true;
    } catch(error) {
      return error;
    }
  }

  sendCommit() {
    const { commit, lastIndex, lastHash } = this.users[this.oneUser];

    return Object.assign({}, {commit, i: lastIndex, ci: lastHash});
  }
}

module.exports = Vendor;
