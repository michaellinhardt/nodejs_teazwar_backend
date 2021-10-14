class AppError extends Error {
  constructor (error_message, status = 500) {
    super('Server Error')
    this.constructor = AppError
    this.__proto__ = AppError.prototype
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.status = status
    this.payload = { error_message }
  }
  render (resOrSocket) {
    return this.status === 'socket'
      ? console.debug('return error by socket', this.payload)
      : resOrSocket.status(this.status).json(this.payload)
  }
}

module.exports = {

  http: {
    Ok: (res, data) => res.status(200).json(data),
  
    StopPipeline: class extends AppError {
      constructor (error_message) {
        super(error_message, 400)
      }
    },
  
    DetectError: (res, err) => {
      if (err instanceof AppError) { return err.render(res) }
      process.stdout.write('Internal Server Error\r\n')
      process.stdout.write(`${(err && err.stack) || (err && err.message) || err}\r\n`)
      if (res.headersSent) { return }
      const payload = { error_message: 'server.error' }
      return res.status(500).json(payload)
    },
  },

  socket: {
    Ok: () => console.debug('render ok by socket'),

    StopPipeline: class extends AppError {
      constructor (error_message) {
        super(error_message, 'socket')
      }
    },

    DetectError: (socket, err) => {
      if (err instanceof AppError) { return err.render(socket) }
      process.stdout.write('Internal Server Error\r\n')
      process.stdout.write(`${(err && err.stack) || (err && err.message) || err}\r\n`)
      if (socket.headersSent) { return }
      const payload = { error_message: 'server.error' }
      return console.debug('return uncaught error by socket', payload)
    },
  },

}
