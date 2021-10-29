
import prettyjson from 'prettyjson'
import http from 'http'
import https from 'https'
import express from 'express'
import cors from 'cors'

const { backend } = require('../../config')

const log = message => backend.isLog ? process.stdout.write(`${message}\n`) : null

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
  },
}

module.exports = {

  getApp: () => express(),

  prepareApp: app => {
    app.set('httpPort', backend.httpPort)
    app.set('httpsPort', backend.httpsPort)
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())

    app.use('/', Middlewares.dumpRequest)
    app.use('/', Middlewares.dumpResponse)
  },

  createHttpsServer: app => https.createServer({
    key: backend.key,
    cert: backend.cert,
    ca: backend.ca,
  }, app),

  createHttpServer: app => http.createServer(app),

  startHttpServer: (httpServer, app) => {
    httpServer.listen(
      app.get('httpPort'),
      () => process.stdout.write(`Server HTTP is running on port ${app.get('httpPort')}\r\n`))
  },

  startHttpsServer: (httpsServer, app) => {
    httpsServer.listen(
      app.get('httpsPort'),
      () => process.stdout.write(`Server HTTPS is running on port ${app.get('httpsPort')}\r\n`))
  },

}
