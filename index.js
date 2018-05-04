const {
        BrokerService,
        USER_CLIENT,
        VENDOR_CLIENT } = require('./broker/broker-service'),
        User            = require('./client/user-service'),
        Vendor          = require('./vendor/vendor-service'),
        config          = require('./config'),
        HashChain       = require('./shared/hash-chain');

const user   = new User(config.user),
      broker = new BrokerService(config.broker),
      vendor = new Vendor(config.vendor);

function registerUserToBroker() {
  const credentials = user.getRegisterCredentials(),
        certificate = broker.registerClient(credentials, USER_CLIENT);

  const hasSet = user.setPaywordCertificate(certificate);
  if(hasSet) {
      console.log('Register user to broker');
  } else {
      console.log('fail');
  }
}

function registerVendorToBank() {
  const credentials = vendor.getRegisterCredentials(),
        certificate = broker.registerClient(credentials, VENDOR_CLIENT);

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

  if(isValid === true) {
    console.log('Payment is valid')
  } else {
    console.log('Payment is invalid', isValid);
  }
}

function sendToBank() {
  const payment = vendor.sendCommit(),
        isValid = broker.registerVendorPayment(payment);

  if (isValid) {
    console.log('Vendor to bank payment is valid');
  } else {
    console.log('Vendor is invalid');
  }
}

registerUserToBroker();
registerVendorToBank();
sendCommit();
pay();
sendToBank();
