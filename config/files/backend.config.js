const fs = require('fs')

module.exports = {
  httpUrl: 'http://localhost',
  httpsUrl: 'https://localhost',

  httpPort: 14242,
  httpsPort: 14040,
  socketPort: 3000,

  isLog: true,

  cert: fs.readFileSync('./config/certificates/mkcert.cert.pem'),
  key: fs.readFileSync('./config/certificates/mkcert.key.pem'),
  ca: fs.readFileSync('./config/certificates/rootCA.pem'),
}
