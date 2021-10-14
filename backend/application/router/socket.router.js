module.exports = {

  init: io => {

    io.on("connection", (socket) => {
      console.debug('socket connection: ', socket)
    })

  },

}
