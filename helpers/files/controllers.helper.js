const _ = require('lodash')
const requireDirectory = require('require-directory')

module.exports = {

  getFlattenControllers: (Controllers) => {
    const controllers = {}
    _.forEach(Controllers, ctrlArray => {
      _.forEach(ctrlArray, route => {
        const routeKey = `${route.route[0].toLowerCase()}${route.route[1]}`
        controllers[routeKey] = route
      })
    })
    return controllers
  },

  prepareBodyFromSocket: socketData => {
    const { extractTwitchData } = require('../files/data.helper')

    const twitchData = _.get(socketData, 'twitchData', {})
    const twitch = _.isEmpty(twitchData) ? undefined : extractTwitchData(twitchData)

    const body = {
      ...socketData,
      method: socketData.method.toLowerCase(),
      twitch,
    }

    delete body.twitchData

    return body
  },

  prepareBodyFromHttp: (req, path) => {
    const { extractTwitchData } = require('../files/data.helper')

    const twitchData = _.get(req, 'body.twitchData', {})
    const twitch = _.isEmpty(twitchData) ? undefined : extractTwitchData(twitchData)

    const requestParam = _.get(req, 'params', {})
    const requestBody = _.get(req, 'body', {})

    const jwtoken = _.get(req, `headers['x-access-token']`, undefined)

    const body = {
      ...requestParam,
      ...requestBody,
      twitch,
      jwtoken,
      method: req.method.toLowerCase(),
      path,
    }

    return body
  },

  runRoute: async (ControllersFlatten, body, requestType = 'script') => {
    const { method, path } = body

    const flattenKey = `${method}${path}`
    const ctrl = ControllersFlatten[flattenKey]

    if (!ctrl) { return ({ payload: { error_key: 'controller.notFound' } }) }

    const routeParam = _.clone(ctrl)
    delete routeParam.Controller

    const controller = new ctrl.Controller(requestType, routeParam, body)

    try {
      await controller.requestHandler()
      return controller

    } catch (err) { return controller }

  }

}

