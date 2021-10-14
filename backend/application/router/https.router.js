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
        const {
          Controller,
          isPublic = false,
          isAdmin = false,
          isMod = false,
          isSub = false,
          isFollow = false,
        } = ctrl

        router[method](path, async (req, res) => {

          const twitchData = _.get(req, 'body.twitchData', {})
          const twitch = Data.extractTwitchData(twitchData)

          const requestParam = _.get(req, 'params', {})
          const requestBody = _.get(req, 'body', {})

          const body = {
            ...requestParam,
            ...requestBody,
          }

          try {

            const controller = new Controller(req, res, twitch)

            const { data: d } = controller

            await controller.identify()

            if (path.startsWith('/command/')) {
              await controller.authorizeTeazmod()
              await controller.identifyChatUser()
            }

            if (!isPublic && !d.user) {
              await controller.StopPipeline('router_isPublic')
            }


            if ((isAdmin || isMod || isSub || isFollow)
            && !d.user) {
              await controller.StopPipeline('router_priviliege')
            }

            if (isAdmin) { await controller.authorizeAdmin() }

            if (isMod && (!d.toon || !d.toon.mod)) {
              await controller.StopPipeline('priviliegeReq.noMod')
            }
            
            if (isSub && (!d.toon || !d.toon.subscriber)) {
              await controller.StopPipeline('priviliegeReq.noSub')
            }
            
            if (isFollow && (!d.toon || !d.toon.follower)) {
              await controller.StopPipeline('priviliegeReq.noFollow')
            }

            if (controller.validator) {
              await controller.validator()
            }

            await controller.handler()

            Renders.http.Ok(res, controller.payload)

          } catch (err) { Renders.http.DetectError(res, err) }
        })

      }))

    app.use('/', router)
  },

}
