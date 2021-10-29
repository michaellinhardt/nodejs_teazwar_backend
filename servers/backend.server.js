import HttpsRouter from '../backend/application/router/https.router'
import SocketRouter from '../backend/application/router/socket.router'
import SocketHelper from '../helpers/files/sockets.helper'
import ExpressHelper from '../helpers/files/express.helper'
import RedisHelper from '../helpers/files/redis.helper'

const start_backend = () => {
  const app = ExpressHelper.getApp()
  ExpressHelper.prepareApp(app)

  RedisHelper.connect('backend.server')

  HttpsRouter.init(app, RedisHelper)

  // HTTP
  // const httpServer = ExpressHelper.createHttpServer(app)
  // const httpSocket = SocketHelper.createSocketHttp()
  // ExpressHelper.startHttpServer(httpServer, app)
  // const ioHttp = SocketHelper.startSocketServer(httpSocket)
  // SocketRouter.init(ioHttp, RedisHelper)

  // HTTPS
  const httpsServer = ExpressHelper.createHttpsServer(app)
  const httpsSocket = SocketHelper.createSocketHttps()
  ExpressHelper.startHttpsServer(httpsServer, app)
  const ioHttps = SocketHelper.startSocketServer(httpsSocket)
  SocketRouter.init(ioHttps, RedisHelper)
}

start_backend()

module.exports = start_backend
