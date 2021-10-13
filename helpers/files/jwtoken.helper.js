const jsonwebtoken = require('jsonwebtoken')
const uuid = require('uuid').v1
const Renders = require('./renders.helper')

const jwt = require('../../config/files/jwt.config')

module.exports = {

  extract: req => {
    const rawToken = req.headers['x-access-token'] || null

    if (!rawToken) {
      throw new Renders.StopPipeline('jwtoken.missing')

    } else if (!rawToken.startsWith('Bearer ')) {
      throw new Renders.StopPipeline('jwtoken.format')
    }

    const token = rawToken.replace('Bearer ', '')

    if (!token) {
      throw new Renders.StopPipeline('jwtoken.format')
    }

    return token
  },

  decrypt: token => {
    try {
      const verifyOptions = {
        issuer: jwt.signOptions.issuer,
        audience: jwt.signOptions.audience,
        expiresIn: jwt.signOptions.expiresIn,
        algorithm: jwt.signOptions.algorithm,
      }

      const jwtoken = jsonwebtoken.verify(token, jwt.publicKEY, verifyOptions)

      const user_uuid = jwtoken.sub

      return { jwtoken, user_uuid }

    } catch (err) { throw new Renders.StopPipeline('jwtoken.invalid') }
  },

  generate: (user_uuid) => {
    const signOptions = Object.assign({}, jwt.signOptions)

    signOptions.subject = user_uuid
    const payload = { uuid: uuid() }

    const token = jsonwebtoken.sign(payload, jwt.privateKEY, signOptions)

    return token
  },

}