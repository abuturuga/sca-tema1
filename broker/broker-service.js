const PaywordComponent = require('../shared/payword-component'),
      HashChain        = require('../shared/hash-chain');

const PAYWORD_CERTIFICATE = 'PAYWORD_CERTIFICATE';
const VENDOR_CERTIFICATE = 'VENDOR_CERTIFICATE';

const USER_CLIENT = 'USER_CLIENT';
const VENDOR_CLIENT = 'VENDOR_CLIENT';

class BrokerService extends PaywordComponent {

  constructor(config) {
    super(config);

    this.clients = {};
  }

  /**
   * Build a new payword certificate for an user
   * @param  {Object} user  User credentials
   * @return {Object}       Payword certificate
   */
  buildPaywordCertificate(user) {
    return {
      userId: user.id,
      userIP: user.ip,
      userPublicKey: user.publicKey,
      exp: new Date('2018-04-04'),
      info: {
        card: '3123123123123123123',
        creditLimit: 200
      }
    };
  }

  /**
   * Build a vendor ceritificate for a vendor
   * @param {Object} vendor Vendor credentials
   */
  buildVendorCertificate(vendor) {
   return {
      vendorId: vendor.id,
      vendorIp: vendor.ip,
      vendorPublicKey: vendor.publicKey
   }
  }

  /**
   * Build a sign certificate based on the client type
   * @param {string} type Certificate type
   * @param {object} credentials Client credentials
   */
  buildCertificate(type, credentials) {
    let certificate = {
      bankPublicKey: this.keys.publicKey,
      bankId: this.id
    };

    let payload;
    switch(type) {
      case PAYWORD_CERTIFICATE:
        payload = this.buildPaywordCertificate(credentials);
        break;
      case VENDOR_CERTIFICATE:
        payload = this.buildVendorCertificate(credentials);
        break;
    }

    payload = Object.assign({}, payload, certificate);
    return this.sign(payload);
  }

  /**
   * Register a new client and build a propper bank certificate
   * @param  {object} client Client data and credentials
   * @param  {object} type   Client type [User | Vendor]
   * @return {object}        Sign certificate
   */
  registerClient(client, type) {
    const { id, password, publicKey, ip } = client;
    if(this.clients[id]) return;

    let certificate;
    if(type === USER_CLIENT) {
      certificate = this.buildCertificate(PAYWORD_CERTIFICATE, client);
    } else if(type === VENDOR_CLIENT) {
      certificate = this.buildCertificate(VENDOR_CERTIFICATE, client);
    } else {
      throw new Error('Undefined client type');
    }
    this.clients[id] = {
      publicKey,
      ip,
      certificate
    };

    return certificate;
  }

  registerVendorPayment(payment) {
    const { commit, ci, i } = payment,
          { c0 } = commit;

    if ( HashChain.validate(c0, ci, i - 1) ) {
      return true;
    }

    return false;
  }
}

module.exports = {
  USER_CLIENT,
  VENDOR_CLIENT,
  BrokerService
};
