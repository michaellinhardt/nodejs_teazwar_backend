import fs from 'fs'
import http from 'http'
import express from 'express'
import prettyjson from 'prettyjson'
const { backend } = require('../../config')
const { Server } = require("socket.io")

import HttpsRouter from './router/https.router'
import SocketRouter from './router/socket.router'

const log = message => process.stdout.write(`${message}\n`)

const start = () => {
    const app = express()

    app.set('port', backend.httpPort)
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    
    app.use('/', Middlewares.dumpRequest)
    app.use('/', Middlewares.dumpResponse)
    
    HttpsRouter.init(app)
    
    const httpServer = http.createServer(app)
    const io = new Server(httpServer, {})
    
    SocketRouter.init(io)
    
    httpServer.listen(
      app.get('port'),
      () => process.stdout.write(`Server HTTP is running on port ${app.get('port')}\r\n`))
    
    io.listen(backend.socketPort)
}

const Middlewares = {
    dumpRequest: (req, res, next) => {
        log(`\n ======== Request: ${req.method} ${req.path} ========`)
        if (req.body) { log(`req.body:\n${prettyjson.render(req.body)}`) }
        return next()
      },
    
      dumpResponse: (req, res, next) => {
        const resStatus = res.status.bind(res)
        res.status = status => {
          log(`- status: ${status}`)
          return resStatus(status)
        }
    
        const resJson = res.json.bind(res)
        res.json = (obj, ...args) => {
          log(`- data:\n${prettyjson.render(obj)}`)
          return resJson(obj, ...args)
        }
    
        return next()
      }
}

start()