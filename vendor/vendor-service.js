const SignService      = require('../shared/sign'),
      KeyGenerator     = require('../shared/keys-generator'),
      HashChain        = require('../shared/hash-chain');

class Vendor {

  constructor() {
    this.id = 0;
    this.users = {};
    this.keys = KeyGenerator();
  }

  /**
   * @param {Object} Broker certificate
   * @returns {Boolean}
   */
  setBrokerCertificate(certificate) {
    if(this.isValidCertificate(certificate)) {
      this.bankCertificate = bankCertificate;
      return true;
    }

    return false;
  }

  /**
   * Get vendor credentials to be used for the bank certificate
   * @returns {Object}
   */
  getCredentials() {
    return {
      id: this.id,
      vendorPublicKey: this.keys.publicKey
    }
  }

  /**
   * Verify if the certificate issued by the bank is valid
   * @param {Object} certificate Vendor certificate
   * @returns {Boolean}
   */
  isValidCertificate(certificate) {
    const { bankPublicKey, signature } = certificate,
          certCopy = Object.assign({}, certificate);

    delete certCopy.signature;
    SignService.verify(bankPublicKey, signature, certCopy.toString());
  }

  /**
   * Validate if the user commit is valid
   * @param {Object} commit User commit
   * @returns {Boolean}
   */
  isValidCommit(commit) {
    const { certificate, signature } = commit,
          { userPublicKey } = certificate,
          commitCopy = Object.assign({}, commit);
    
    delete commitCopy.signature;
    return SignService.verify(userPublicKey, signature, commitCopy.toString());
  }

  addCommit(commit) {
    if(this.isValidCommit(commit)) {
      const { certificate } = commit,
            { userId, info } = certificate;
      
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