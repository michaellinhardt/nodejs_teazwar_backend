const prettyjson = require('prettyjson')
const _ = require('lodash')
const { jwt: { teazwarToken } } = require('../../config')

let ControllersFlatten = null
const getFlattenControllers = () => {
  if (!ControllersFlatten) {
    const { importDefaultByFilename } = require('./imports.helper')
    const Controllers = importDefaultByFilename(`${__dirname}/../../backend/controllers`, '.controller')
    ControllersFlatten = {}
    _.forEach(Controllers, ctrlArray => {
      _.forEach(ctrlArray, route => {
        const routeKey = `${route.route[0].toLowerCase()}${route.route[1]}`
        ControllersFlatten[routeKey] = route
      })
    })
  }
  return ControllersFlatten
}

const runRoute = async (body, requestType = 'script') => {
  const { method = '', path = '' } = body

  if (!ControllersFlatten) { getFlattenControllers() }

  const flattenKey = `${method}${path}`
  const ctrl = ControllersFlatten[flattenKey]

  if (!ctrl) { return ({ payload: { error_key: 'controller_notFound' } }) }

  const routeParam = _.clone(ctrl)
  delete routeParam.Controller

  const controller = new ctrl.Controller(requestType, routeParam, body)

  try {
    await controller.requestHandler()
  } catch (err) { console.debug(err) }

  const payload = _.get(controller || {}, 'payload', { error_key: 'server_error' })

  console.debug(`\n=======[ ${body.method.toUpperCase()} ${body.path} ]=======`)
  delete body.jwtoken
  delete body.method
  delete body.path
  console.debug(prettyjson.render(body))

  if (_.isEmpty(payload)) { payload.payload = 'NO PAYLOAD' }
  console.debug('->\n', prettyjson.render(payload || { payload: 'none' }))

  return controller

}

module.exports = {

  getFlattenControllers,

  prepareBodyFromSocket: socketData => {
    const { extractTwitchData } = require('./data.helper')

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
    const { extractTwitchData } = require('./data.helper')

    const twitchData = _.get(req, 'body.twitchData', {})
    const twitch = _.isEmpty(twitchData) ? undefined : extractTwitchData(twitchData)

    const requestParam = _.get(req, 'params', {})
    const requestBody = _.get(req, 'body', {})

    const jwtoken = _.get(req, 'headers[\'x-access-token\']', undefined)

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

  runRoute,
  runRouteTeazwar: (body, requestType = 'script') => {
    body.jwtoken = teazwarToken
    return runRoute(body, requestType)
  },

}

