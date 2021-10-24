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

  const httpServer = ExpressHelper.createHttpServer(app)
  const io = SocketHelper.createSocketServer()

  SocketRouter.init(io, RedisHelper)

  SocketHelper.startSocketServer(io)
  ExpressHelper.startHttpServer(httpServer, app)
}

start_backend()

module.exports = start_backend
