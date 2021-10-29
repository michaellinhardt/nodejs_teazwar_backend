const prettyjson = require('prettyjson')
const _ = require('lodash')
const { jwt: { teazwarToken }, backend: { isLog } } = require('../../config')

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

const runRouteTeazwar = (body, requestType = 'script') => {
  body.jwtoken = teazwarToken
  return runRoute(body, requestType)
}

const prepareBodyFromSocket = socketData => {
  const body = {
    ...socketData,
  }
  return body
}

const prepareBodyFromHttp = (req, path) => {

  const requestParam = _.get(req, 'params', {})
  const requestBody = _.get(req, 'body', {})

  const jwtoken = _.get(req, 'headers[\'x-access-token\']', undefined)

  const body = {
    ...requestParam,
    ...requestBody,
    jwtoken,
    method: req.method.toLowerCase(),
    path,
  }

  return body
}

const runRoute = async (body = {}, requestType = 'script') => {
  const { method = '', path = '' } = body

  if (!ControllersFlatten) { getFlattenControllers() }

  if (requestType !== 'http') { body = prepareBodyFromSocket(body) }

  const flattenKey = `${method}${path}`
  const ctrl = ControllersFlatten[flattenKey]

  if (!ctrl) {
    const payload = { payload: { error_key: 'controller_notFound' } }
    logCall(body, payload)
    return payload
  }

  const routeParam = _.clone(ctrl)
  delete routeParam.Controller

  const controller = new ctrl.Controller(requestType, routeParam, body)

  await controller.requestHandler()

  const payload = _.get(controller || {}, 'payload', { error_key: 'server_error' })

  if (!isLog) { return controller }

  logCall(body, payload)

  return controller
}

const logCall = (body = {}, payload = {}) => {

  console.info(`\n=======[ ${body.method.toUpperCase()} ${body.path} ]=======`)
  delete body.jwtoken
  delete body.method
  delete body.path

  const body_big_data = _.get(body, 'big_data', undefined)
  const payload_big_data = _.get(payload, 'big_data', undefined)

  delete body.big_data
  delete payload.big_data

  if (body_big_data && body_big_data.message) {
    _.set(body, 'big_data.msg', body_big_data.message.content)
    _.set(body, 'big_data.author', body_big_data.message.author.username)
  }

  try {
    console.info(prettyjson.render(body))
  } catch (err) { console.log(JSON.stringify(body, null, 2)) }

  try {
    console.info('->\n', prettyjson.render(payload))
  } catch (err) { console.log(JSON.stringify(payload, null, 2)) }

  if (body_big_data) { body.big_data = body_big_data }
  if (payload_big_data) { payload.big_data = payload_big_data }
}

module.exports = {

  getFlattenControllers,

  prepareBodyFromHttp,

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

