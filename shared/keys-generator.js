const NodeRSA = require('node-rsa');

/**
 * Generate Public and Private RSA key pairs
 * @return {Object}
 */
function generateRSA() {
  const generator = new NodeRSA({b: 512}),
        privateKey = generator.exportKey(),
        publicKey = generator.exportKey('pkcs8-public');

  return {privateKey, publicKey};
}

module.exports = generateRSA;
