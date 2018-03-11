const crypto = require('crypto');


function sha256(string) {
  return crypto
    .createHash('sha256')
    .update(string)
    .digest('base64');
}

const secret = 'test';
const CHAIN_SIZE = 20;

const hashChain = [];

let c0 = sha256(secret);
hashChain.push(c0);

for(let i = 0; i < CHAIN_SIZE; i++) {
  let hash = hashChain[i];
  hashChain.push(sha256(hash));
}
