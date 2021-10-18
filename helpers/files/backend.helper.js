const prettyjson = require('prettyjson')
const _ = require('lodash')
const { jwt: { teazwarToken } } = require('../../config')

let ControllersFlatten = null
const getFlattenControllers = () => {
  if (!ControllersFlatten) {
    const { importDefaultByFilename } = require('./imports.helper')
    const Controllers = importDefaultByFilename(
      `${__dirname}/../../backend/controllers`, '.controller')
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

const runRoute = async (body = {}, requestType = 'script') => {
  const { method = '', path = '' } = body

  if (!ControllersFlatten) { getFlattenControllers() }

  const flattenKey = `${method}${path}`
  const ctrl = ControllersFlatten[flattenKey]

  if (!ctrl) { return ({ payload: { error_key: 'controller_notFound' } }) }

  const routeParam = _.clone(ctrl)
  delete routeParam.Controller

  const controller = new ctrl.Controller(requestType, routeParam, body)

  await controller.requestHandler()

  const payload = _.get(controller || {}, 'payload', { error_key: 'server_error' })

  console.debug(`\n=======[ ${body.method.toUpperCase()} ${body.path} ]=======`)
  delete body.jwtoken
  delete body.method
  delete body.path

  const big_data = _.get(body, 'big_data', undefined)
  delete body.big_data
  delete payload.big_data
  if (big_data && big_data.message) {
    _.set(body, 'big_data.msg', big_data.message.content)
    _.set(body, 'big_data.author', big_data.message.author.username)
  }

  try {
    console.debug(prettyjson.render(body))
  } catch (err) { console.log(JSON.stringify(body, null, 2)) }

  try {
    console.debug('->\n', prettyjson.render(payload))
  } catch (err) { console.log(JSON.stringify(payload, null, 2)) }

  if (big_data) {
    body.big_data = big_data
    payload.big_data = big_data
  }

  return controller

}

const runRouteTeazwar = (body, requestType = 'script') => {
  body.jwtoken = teazwarToken
  return runRoute(body, requestType)
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
  runRouteTeazwar,

  discordReportError: (error_location, error_message) => {
    return runRouteTeazwar({
      method: 'post',
      path: '/debug/discord/report',
      errorArray: [
        'debug_discord_report',
        error_location,
        error_message,
      ],
    })
  },

}

