const response = (res, code = 200, data = {}) => res.status(code).json(data)

class AppError extends Error {
  constructor (error_message, status = 500) {
    super('Server Error')

    this.constructor = AppError
    this.__proto__ = AppError.prototype
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)

    this.status = status
    this.content = { error_message }
  }

  render (res) { return res.status(this.status).json(this.content) }
}

module.exports = {

  Ok: (res, data) => response(res, 200, data),

  StopPipeline: class extends AppError {
    constructor (error_message) {
      super(error_message, 400)
    }
  },

  DetectError: (res, err) => {

    if (err instanceof AppError) {
      return err.render(res)
    }

    process.stdout.write('Internal Server Error\r\n')
    process.stdout.write(`${(err && err.stack) || (err && err.message) || err}\r\n`)

    if (res.headersSent) { return }

    const error_message = 'Internal Server Error'
    const result = { error_message }
    return res.status(500).json(result)
  },

}
