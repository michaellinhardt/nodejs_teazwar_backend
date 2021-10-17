import express from 'express'
import requireDirectory from 'require-directory'
import _ from 'lodash'

import RendersHelper from '../../../helpers/files/renders.helper'
import BackendHelper from '../../../helpers/files/backend.helper'

module.exports = {

  init: app => {
    const router = express.Router()
    const controllers = requireDirectory(module, '../../controllers')

    _.forEach(controllers, file =>

      _.forEach(file.default, ctrl => {

        const [method, path] = ctrl.route
        router[method](path, async (req, res) => {

          const body = BackendHelper.prepareBodyFromHttp(req, path)

          try {

            const controller = await BackendHelper.runRoute(body, 'http')
            RendersHelper.http.Ok(res, controller.payload)

          } catch (err) { RendersHelper.http.DetectError(res, err) }
        })

      }))

    app.use('/', router)
  },

}
