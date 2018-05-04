const crypto = require('crypto');

/**
 * Sign a message with a private key
 *
 * @param  {String} string      Stringify model
 * @param  {String} privateKey  RSA private key
 * @return {String}             Signature
 */
function sign(string, privateKey) {
  const instance = crypto.createSign('SHA256');
  instance.update(string);
  return instance.sign(privateKey, 'base64');
}

/**
 * Verifiy if the string is a valid RSA signature.
 *
 * @param  {String} publicKey   RSA public key
 * @param  {String} signature   RSA signature
 * @param  {String} message
 * @return {Boolean}
 */
function verify(publicKey, signature, message) {
  if (typeof message !== 'string') {
    throw new Error('Message parameter must be a string');
  }

  const instance = crypto.createVerify('SHA256');
  instance.update(message);
  return instance.verify(publicKey, signature, 'base64');
}

module.exports = {
  sign,
  verify
}
