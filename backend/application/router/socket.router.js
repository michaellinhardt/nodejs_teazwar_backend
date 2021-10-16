const prettyjson = require('prettyjson')
const _ = require('lodash')

const { Emitter } = require("@socket.io/redis-emitter")
const { createClient } = require("redis")
const redisClient = createClient({ host: "localhost", port: 6379 })
const emitter = new Emitter(redisClient)

const h = require('../../../helpers')
const { jwt: { teazwarToken } } = require('../../../config')
const { imports: { importDefaultByFilename }, controllers: { getFlattenControllers, runRoute } } = h

const Controllers = importDefaultByFilename(`${__dirname}/../../controllers`, '.controller')
const ControllersFlatten = getFlattenControllers(Controllers)



module.exports = {

  init: io => {

    io.on("connection", (socket) => {
      socket.on("disconnect", async reason => {

        const data = {
          path: '/socket/disconnected',
          method: 'post',
          jwtoken: teazwarToken,
          reason,
          socket_id: socket.id,
        }

        console.debug(`\n=======[ SOCK ${data.method.toUpperCase()} ${data.path} ]=======`)
        console.debug(prettyjson.render(data))

        const { payload } = await runRoute(ControllersFlatten, data)

        console.debug('->\n', prettyjson.render(payload))
      });


      console.debug('socket connection: ', socket.id)
      socket.onAny(async (data = {}) => {

        if (typeof(data) !== 'object' || Array.isArray(data)) {
          return false
        }

        data.path = _.get(data, 'path', '')
        data.method = _.get(data, 'method', '')
        data.jwtoken = _.get(data, 'jwtoken', undefined)
        data.socket_id = socket.id

        console.debug(`\n=======[ SOCK ${data.method.toUpperCase()} ${data.path} ]=======`)
        console.debug(prettyjson.render(data))

        const { payload } = await runRoute(ControllersFlatten, data)

        console.debug('->\n', prettyjson.render(payload))

      })
    })

  },

}
