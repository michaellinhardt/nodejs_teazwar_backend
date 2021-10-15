const _ = require('lodash')



const { Emitter } = require("@socket.io/redis-emitter")
const { createClient } = require("redis")
const redisClient = createClient({ host: "localhost", port: 6379 })
const emitter = new Emitter(redisClient)


const sockIds = {}

const areYouThere = (io) => {
  _.forEach(sockIds, (id, name) => {
    emitter.to(id).emit('areyouthere', { name })
  })
}

module.exports = {

  init: io => {

    io.on("connection", (socket) => {
      socket.on("disconnect", (reason) => {
        _.forEach(sockIds, (id, name) => {
          if (id === socket.id) {
            delete sockIds[name]
            console.debug(`Disconnection from: ${name}`)
          }
        })
        setTimeout(() => areYouThere(io), 1000)
      });


      console.debug('socket connection: ', socket.id)
      socket.onAny((eventName, ...args) => {

        // console.debug(`Received from: ${socket.id} [${eventName}]\n`, args[0])

        const data = args[0] || {}

        if (eventName === 'iam') {
          const name = data.name
          sockIds[name] = socket.id
          console.debug(`Loggin from: ${socket.id} [${data.name}]`)
          emitter.to(socket.id).emit('hello', {name})
        }

      });
    })

  },

}
