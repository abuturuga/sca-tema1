const Broker = require('./broker/broker-service'),
      User   = require('./client/user-service'),
      Vendor = require('./vendor/vendor-service'),
      config = require('./config'),
      HashChain = require('./shared/hash-chain');

const user = new User(),
      broker = new Broker(config.broker),
      vendor = new Vendor();

function registerUserToBroker() {
  const credentials = user.createUserRegistration(),
        certificate = broker.registerUser(credentials);
  
  const hasSet = user.setPaywordCertificate(certificate);
  if(hasSet) {
      console.log('Register user to broker');
  } else {
      console.log('fail');
  }
}

function registerVendorToBank() {
  const credentials = vendor.getCredentials(),
        certificate = broker.registerVendor(credentials);
  
  const hasSet = vendor.setBrokerCertificate(certificate);
  if(hasSet) {
    console.log('Vendor certificate with success')
  } else {
    console.log('Vendor certificate with fail') 
  }
}

function sendCommit() {
  const commit = user.buildCommit(),
        isValid = vendor.addCommit(commit);
  
  if(isValid) {
    console.log('User commit is valid')
  } else {
    console.log('User commit is invalid');
  }
}

function pay() {
  const pay = user.pay(5),
        isValid = vendor.addPayment(pay);

  if(isValid) {
    console.log('Payment is valid')
  } else {
    console.log('Payment is invalid');
  }
}

registerUserToBroker();
registerVendorToBank();
sendCommit();
pay();