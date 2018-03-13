const Broker = require('./broker/broker-service'),
      User   = require('./client/user-service'),
      config = require('./config');

const user = new User(),
      broker = new Broker(config.broker);

function registerUserToBroker() {
  const credentials = user.createUserRegistration(),
        certificate = broker.registerUser(credentials);
  
  const hasSet = user.setPaywordCertificate(certificate);
  if(hasSet) {
      console.log('success');
  } else {
        console.log('fail');
  }
}

registerUserToBroker();
