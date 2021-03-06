const jsonwebtoken = require('jsonwebtoken')
const uuid = require('uuid').v1

const jwt = require('../../config/files/jwt.config')

module.exports = {

  decrypt: (token, isTwitch = true) => {
    try {
      const verifyOptions = !isTwitch ? {
        issuer: jwt.signOptions.issuer,
        audience: jwt.signOptions.audience,
        expiresIn: jwt.signOptions.expiresIn,
        algorithm: jwt.signOptions.algorithm,

      } : { algorithms: ['HS256'] }

      // const secret = !isTwitch ? jwt.publicKEY : jwt.twitchSecret
      const secret = jwt.twitchSecret

      const jwtoken = jsonwebtoken.verify(token, secret, verifyOptions)

      jwtoken.token = token

      return { jwtoken, user_id: jwtoken.user_id }

      // return !isTwitch
      //   ? { jwtoken, user_uuid: jwtoken.sub }
      //   : { jwtoken, user_id: jwtoken.user_id }

    } catch (err) {
      console.error(err)
      return false
    }
  },

  generate: (user_uuid) => {
    const signOptions = Object.assign({}, jwt.signOptions)

    signOptions.subject = user_uuid
    const payload = { jwtoken_uuid: uuid() }

    const token = jsonwebtoken.sign(payload, jwt.privateKEY, signOptions)

    return token
  },

}
