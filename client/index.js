const ClientSocket = require('../socket/client'),
      config       = require('../config');


const vendorSocket = new ClientSocket(config.vendor);

async function init() {
  try {
    await vendorSocket.connect();
    vendorSocket.send({message: 'test'});
  } catch(error) {
    console.log(error);
  }
}

init();
