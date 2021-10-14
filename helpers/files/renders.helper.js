class AppError extends Error {
  constructor (error_key, status = 500) {
    super('Server Error')
    this.constructor = AppError
    this.__proto__ = AppError.prototype
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.status = status
    this.payload = { error_key }
  }
  render (renderObject) {
    if (this.status === 'socket') {
      return console.debug('return error by socket', this.payload)

    } else if (this.status === 'http') {
      return renderObject.status(this.status).json(this.payload)

    } else {
      return console.debug('return error by script', this.payload)
    }
  }
}

module.exports = {

  http: {
    Ok: (res, data) => res.status(200).json(data),
  
    StopPipeline: class extends AppError {
      constructor (error_key) {
        super(error_key, 400)
      }
    },
  
    DetectError: (res, err) => {
      if (err instanceof AppError) { return err.render(res) }
      process.stdout.write('Internal Server Error\r\n')
      process.stdout.write(`${(err && err.stack) || (err && err.message) || err}\r\n`)
      if (res.headersSent) { return }
      const payload = { error_key: 'server_error' }
      return res.status(500).json(payload)
    },
  },

  socket: {
    Ok: () => console.debug('render ok by socket'),

    StopPipeline: class extends AppError {
      constructor (error_key) {
        super(error_key, 'socket')
      }
    },

    DetectError: (socket, err) => {
      if (err instanceof AppError) { return err.render(socket) }
      process.stdout.write('Internal Server Error\r\n')
      process.stdout.write(`${(err && err.stack) || (err && err.message) || err}\r\n`)
      if (socket.headersSent) { return }
      const payload = { error_key: 'server_error' }
      return console.debug('return uncaught error by socket', payload)
    },
  },

  script: {
    Ok: () => console.debug('render ok by script'),

    StopPipeline: class extends AppError {
      constructor (error_key) {
        super(error_key, 'script')
      }
    },

    DetectError: (socket, err) => {
      if (err instanceof AppError) { return err.render(socket) }
      process.stdout.write('Internal Server Error\r\n')
      process.stdout.write(`${(err && err.stack) || (err && err.message) || err}\r\n`)
      if (socket.headersSent) { return }
      const payload = { error_key: 'server_error' }
      return console.debug('return uncaught error by script', payload)
    },
  },

}
