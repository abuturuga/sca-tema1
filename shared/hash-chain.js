const crypto = require('crypto');

/**
 * Wrapper over sha256 hash
 * @param {string} string String to encripted
 */
function sha256(string) {
  return crypto
    .createHash('sha256')
    .update(string)
    .digest('base64');
}

/**
 * Generate a new hash chain
 * @param {number} size Chain limit
 */
function generate(size) {
  const secret = Math.random().toString(36).substring(2, 15),
        chain = [];

  for(let i = 0; i < size; i++) {
    chain.push(sha256(chain[i]));
  }

  return chain;
}

/**
 * Validate if a given hash belongs to a specific chain
 * @param {string} root Element c0
 * @param {string} hash Current hash element 
 * @param {string} index Current index element 
 */
function validate(root, hash, index) {

}

module.exports = {
  sha256,
  generate,
  validate
}
