const http = require('http'),
      fs   = require('fs'),
      Client = require('../user-client');

const client = new Client();

function sendTemplate(response) {
  fs.readFile('./interface-template.html', (error, html) => {
    if(error) throw error;

    response.writeHeader(200, {"Content-Type": "text/html"});
    response.write(html);
    response.end();
  });
}

async function register(response) {
  try {
    const certificate = await client.registerToBroker();

    response.writeHeader(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(certificate));
    response.end();
  } catch(error) {
    console.log(error);
  }
}

function router(request, response) {
  const path = request.url,
        method = request.method;
  console.log(path, method);
  if(path === '/' && method === 'GET') {
    sendTemplate(response);
  } else if(path === '/register' && method === 'GET') {
    register(response);
  }
}

const server = http.createServer(router);
server.listen(8000);
