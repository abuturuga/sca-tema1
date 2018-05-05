const SocketServer      = require('../socket/server'),
      {
        BrokerService,
        USER_CLIENT,
        VENDOR_CLIENT } = require('./broker-service'),
      config            = require('../config'),
      actions           = require('../shared/actions');

const prefix = 'BANK::';

class BrokerServer {

  constructor(config) {
    this.server = new SocketServer(config);
    this.server.start();

    this.service = new BrokerService(config);
  }

  handleData(data, socket) {
    switch (data.type) {
      case actions.REGISTER_USER: {
        const paywordCertificate = this.service.registerClient(data.payload, USER_CLIENT);
        socket.write(JSON.stringify({
          type: actions.SEND_USER_PAYWORD_CERTIFICATE,
          payload: paywordCertificate
        }));
        console.log(`BANK:: User ${paywordCertificate.userId} is registred`);
        break;
      }
      case actions.REGISTER_VENDOR: {
        const vendorCertificate = this.service.registerClient(data.payload, VENDOR_CLIENT);
        socket.write(JSON.stringify({
          type: actions.SEND_VENDOR_CERTIFICATE,
          payload: vendorCertificate
        }));
        console.log(`BANK:: User ${vendorCertificate.vendorId} is registred`);
        break;
      }
      case actions.SEND_VENDOR_PAYMENT: {
        const isValid = this.service.registerVendorPayment(data.payload);

        if (isValid === true) {
          console.log(`${prefix} payment is valid`);
          socket.write(JSON.stringify({
            type: actions.OPERATION_SUCCEED
          }));
        } else {
          console.log(`${prefix} payment is invalid: ${isValid}`);
        }
      }
    }
  }

  listen() {
    this.server.onClientConnect(socket => {
      socket.on('data', payload => {
        this.handleData(JSON.parse(payload), socket);
      });
    });
  }

}

const server = new BrokerServer(config.broker);
server.listen();