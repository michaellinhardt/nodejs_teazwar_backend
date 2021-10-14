import express from 'express'
import requireDirectory from 'require-directory'
import _ from 'lodash'

import Renders from '../../../helpers/files/renders.helper'
import Data from '../../../helpers/files/data.helper'

module.exports = {

  init: app => {
    const router = express.Router()
    const controllers = requireDirectory(module, '../../controllers')

    _.forEach(controllers, file =>

      _.forEach(file.default, ctrl => {

        const [method, path] = ctrl.route
        const routeParam = {
          isPublic: ctrl.isPublic || false,
          isAdmin: ctrl.isAdmin || false,
          isMod: ctrl.isMod || false,
          isSub: ctrl.isSub || false,
          isFollow: ctrl.isFollow || false,
        }

        router[method](path, async (req, res) => {

          routeParam.path = path

          const twitchData = _.get(req, 'body.twitchData', {})
          const twitch = _.isEmpty(twitchData) ? undefined : Data.extractTwitchData(twitchData)

          const requestParam = _.get(req, 'params', {})
          const requestBody = _.get(req, 'body', {})

          const jwtoken = _.get(req, `headers['x-access-token']`, undefined)

          const body = {
            ...requestParam,
            ...requestBody,
            twitch,
            jwtoken,
          }

          try {
            const controller = new ctrl.Controller('http', routeParam, body)
            await controller.requestHandler()
            Renders.http.Ok(res, controller.payload)
          } catch (err) { Renders.http.DetectError(res, err) }
        })

      }))

    app.use('/', router)
  },

}
