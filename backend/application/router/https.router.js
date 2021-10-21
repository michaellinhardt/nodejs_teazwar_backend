import express from 'express'
import requireDirectory from 'require-directory'
import _ from 'lodash'

import RendersHelper from '../../../helpers/files/renders.helper'
import BackendHelper from '../../../helpers/files/backend.helper'

let redis = null

module.exports = {

  init: (app, redisHandler) => {
    if (!redis) { redis = redisHandler }
    const router = express.Router()
    const controllers = requireDirectory(module, '../../controllers')

    _.forEach(controllers, file =>

      _.forEach(file.default, ctrl => {

        const [method, path] = ctrl.route
        router[method](path, async (req, res) => {

          const body = BackendHelper.prepareBodyFromHttp(req, path)
          _.set(body, 'big_data.redis', redis)

          try {

            const controller = await BackendHelper.runRoute(body, 'http')
            RendersHelper.http.Ok(res, controller.payload)

          } catch (err) {
            RendersHelper.http.DetectError(res, err)

            const error_location = `http${path.split('/').join('..').replace(':', '*')}`
            const { payload = {} } = await BackendHelper
              .discordReportError(error_location, err.message)

            if (payload.say && payload.socketIds) {
              const SocketHelper = require('../../../helpers/files/sockets.helper')
              await SocketHelper.dispatchSayOrder(payload, 'https.router')
            }
          }
        })

      }))

    app.use('/', router)
  },

}
