const SocketServer      = require('../socket/server'),
      {
        BrokerService,
        USER_CLIENT,
        VENDOR_CLIENT } = require('./broker-service'),
      config            = require('../config'),
      actions           = require('../shared/actions');

class BrokerServer {

  constructor(config) {
    this.server = new SocketServer(config);
    this.server.start();

    this.service = new BrokerService(config);
  }

  handleData(data, socket) {
    switch (data.type) {
      case actions.REGISTER_USER: {
        const paywordCertificate = this.service.registerUser(data.payload);
        socket.write(JSON.stringify({
          type: actions.SEND_USER_PAYWORD_CERTIFICATE,
          payload: paywordCertificate
        }));
        break;
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
