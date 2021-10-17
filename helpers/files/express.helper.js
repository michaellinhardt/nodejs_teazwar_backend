
import http from 'http'
import express from 'express'
const { backend } = require('../../config')

const log = message => process.stdout.write(`${message}\n`)

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
    app.set('port', backend.httpPort)
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/', Middlewares.dumpRequest)
    app.use('/', Middlewares.dumpResponse)
  },

  createHttpServer: app => http.createServer(app),

  startHttpServer: (httpServer, app) => httpServer.listen(
    app.get('port'),
    () => process.stdout.write(`Server HTTP is running on port ${app.get('port')}\r\n`)),

}
