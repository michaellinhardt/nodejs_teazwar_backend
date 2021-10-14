import express from 'express'
import requireDirectory from 'require-directory'
import _ from 'lodash'

import RendersHelper from '../../../helpers/files/renders.helper'
import ControllersHelper from '../../../helpers/files/controllers.helper'

module.exports = {

  init: app => {
    const router = express.Router()
    const controllers = requireDirectory(module, '../../controllers')

    _.forEach(controllers, file =>

      _.forEach(file.default, ctrl => {

        const [method, path] = ctrl.route
        const routeParam = _.clone(ctrl)
        delete routeParam.Controller

        router[method](path, async (req, res) => {

          const body = ControllersHelper.prepareBodyFromHttp(req, path)

          try {
            const controller = new ctrl.Controller('http', routeParam, body)
            await controller.requestHandler()
            RendersHelper.http.Ok(res, controller.payload)

          } catch (err) { RendersHelper.http.DetectError(res, err) }
        })

      }))

    app.use('/', router)
  },

}
