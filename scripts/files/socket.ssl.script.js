const { backend } = require('../../config')

const options = {
  key: backend.key,
  cert: backend.cert,
  ca: backend.ca,
}

// Servers with and without SSL
const http = require('http')
const https = require('https')
const httpPort = 3333
const httpsPort = 3000
const httpServer = http.createServer()
const httpsServer = https.createServer({
  ...options,
})
httpServer.listen(httpPort, () => {
  console.log(`Listening HTTP on ${httpPort}`)
})
httpsServer.listen(httpsPort, () => {
  console.log(`Listening HTTPS on ${httpsPort}`)
})

// Socket.io
const ioServer = require('socket.io')
const io = ioServer()
io.attach(httpServer)
io.attach(httpsServer)

io.on('connection', (socket) => {

  console.log('user connected', socket.id)
  // ... your code

})
