import HttpsRouter from '../backend/application/router/https.router'
import SocketRouter from '../backend/application/router/socket.router'
import SocketHelper from '../helpers/files/sockets.helper'
import ExpressHelper from '../helpers/files/express.helper'

const start = () => {
    const app = ExpressHelper.getApp()
    ExpressHelper.prepareApp(app)
    HttpsRouter.init(app)

    const httpServer = ExpressHelper.createHttpServer(app)
    const io = SocketHelper.createSocketServer()

    SocketRouter.init(io)

    SocketHelper.startSocketServer(io)
    ExpressHelper.startHttpServer(httpServer, app)
}

start()