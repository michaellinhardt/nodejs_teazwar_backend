import _ from 'lodash'

const config = require('../../../config')
const gameConfig = require('../../../game/config')

const { importDefaultByFilename } = require('../../../helpers/files/imports.helper')

const Helpers = require('../../../helpers')
const GameHelpers = require('../../../game/helpers')
const Languages = require('../../../languages')
const Services = importDefaultByFilename('../../backend/services', '.service')
const Models = importDefaultByFilename('../../backend/models', '.model')
const Payloads = importDefaultByFilename('../../backend/payloads', '.payload')
const Apis = importDefaultByFilename('../../backend/apis', '.api')
const GameModules = importDefaultByFilename('../../game/modules', '.modules')
const GameAuras = importDefaultByFilename('../../game/auras', '.aura')

import ModelSuperclass from './model.superclass'
class EmptyModel extends ModelSuperclass {}

export default class {

  constructor (requestType, routeParam, body = {}) {
    this.requestType = requestType
    this.routeParam = routeParam
    const [method, path] = routeParam.route
    routeParam.method = method
    routeParam.path = path
    this.build_ressources(body)
  }

  async requestHandler () {
    const { data: d } = this
    const {
      path = '',
      isPublic = false,
      isTeazwar = false,
      isStranger = false,
      isAdmin = false,
      isSubscriber = false,
      isFollower = false,
    } = this.routeParam

    // console.info(this.helpers.jwtoken.generate('1e8b6bf0-1b50-11ec-85ec-4d033c80c035'))

    if (!isTeazwar) {
      await this.identify()

    } else { await this.identifyTeazwar() }

    if (path.startsWith('/command/')) {
      await this.identifyChatUser()
    }

    if (!isTeazwar
      && !isPublic
      && ((isStranger && !d.user && !d.stranger && !d.opaque_user_id)
      || (!isStranger && !d.user))) {
      this.StopPipeline('jwtoken_strangerOrUserOnly')
    }

    if (!isTeazwar
    && !isStranger
    && !d.user
    && (!isPublic || isAdmin || isSubscriber || isFollower)) {
      this.StopPipeline('jwtoken_notPublic')
    }

    if ((isAdmin || isSubscriber || isFollower) && !d.user) {
      this.StopPipeline('jwtoken_priviliege1')
    }

    if (isAdmin) { await this.authorizeAdmin() }

    if (isSubscriber && d.user.isSubscriber !== 'yes') {
      this.StopPipeline('required_isSubscriber')
    }

    if (isFollower && d.user.isFollower !== 'yes') {
      this.StopPipeline('required_isFollower')
    }

    if (this.validator) {
      await this.validator()
    }

    await this.handler()
  }

  StopPipeline (error_key = 'unknow_error') {
    this.payload.error_key = error_key
    throw new this.renders.StopPipeline(error_key)
  }

  identifyTeazwar () {
    const { body: b, config: c } = this

    if (!b.jwtoken || typeof (b.jwtoken) !== 'string' || !b.jwtoken.length) {
      return this.StopPipeline('jwtoken_teazwarTokenMissing')
    }

    if (b.jwtoken !== c.jwt.teazwarToken) {
      return this.StopPipeline('jwtoken_teazwarTokenInvalid')
    }

  }

  async identify () {
    const { helpers: h, services: s, data: d, body: b } = this
    if (!b.jwtoken) { return false }

    if (typeof (b.jwtoken) !== 'string' || !b.jwtoken.length) {
      this.StopPipeline('jwtoken_missing')
    }

    const decryptedJwtoken = h.jwtoken.decrypt(b.jwtoken)
    if (decryptedJwtoken === false) {
      this.StopPipeline('jwtoken_invalid')
    }

    d.jwtoken = decryptedJwtoken.jwtoken

    if (!decryptedJwtoken.user_id) {

      const opaque_user_id = _.get(decryptedJwtoken, 'jwtoken.opaque_user_id', undefined)
      if (!opaque_user_id) { return this.StopPipeline('jwtoken_noOpaqueUserId') }

      const isStranger = await s.strangers.getByOpaqueUserId(opaque_user_id)
      d.stranger = isStranger
      d.opaque_user_id = _.get(isStranger || {}, 'opaque_user_id', undefined)
      return true

    }

    const isUser = await s.users.getByUserId(decryptedJwtoken.user_id)

    if (isUser && isUser.jwtoken === decryptedJwtoken.jwtoken.token) {
      d.jwtoken = decryptedJwtoken.jwtoken
      d.user = isUser
      d.user_id = isUser.user_id
      d.user_uuid = isUser.user_uuid
    }
  }

  async identifyChatUser () {
    const { services: s, data: d, twitch: t } = this

    if (t.userId) {
      d.user = await s.users.getByUserId(t.userId)
      d.user_uuid = _.get(d, 'user.user_uuid', null)

    } else {
      delete d.user
      delete d.user_uuid
    }

  }

  async authorizeAdmin () {
    const { services: s, data: d } = this
    const { user_uuid } = d.user

    if (d.user && (d.user.username === 'teazyou'
    || d.user.username === 'teazwar')) {
      return true
    }

    d.admin = await s.admins.getByUserUuid(user_uuid)

    if (!d.admin) { this.StopPipeline('priviliege_isAdmin') }
  }

  build_ressources (body) {
    const bodyRedis = _.get(body, 'big_data.redis', undefined)
    const bodySocket = _.get(body, 'big_data.socket', undefined)
    const bodyInteraction = _.get(body, 'big_data.interaction', undefined)

    const ressources = {
      body,
      apis: Apis,
      helpers: _.merge({}, Helpers, GameHelpers),
      data: {},
      db: {},
      payload: {},
      renders: this.init_renders(),
      log: msg => process.stdout.write(`${msg}\n`),
      config: _.merge({}, config, gameConfig),
      lang: Languages,
    }

    if (bodyInteraction) {
      _.set(ressources, 'payload.big_data.interaction', bodyInteraction)
    }

    if (bodySocket) {
      ressources.socket = bodySocket
    }

    if (bodyRedis) {
      _.set(body, 'big_data.redis', undefined)
      ressources.redis = bodyRedis

    } else {
      ressources.helpers.redis.connect('controller.superclass')
      ressources.redis = ressources.helpers.redis
    }

    const modelRessources = { helpers: Helpers }
    const models = {}
    _.forEach(Models, (Model, name) => { models[name] = new Model(modelRessources) })
    _.forEach(Services, (Service, name) => {
      if (!models[name]) { models[name] = new EmptyModel(modelRessources) }
    })

    this.services = {}
    _.forEach(Services, (Service, name) => {
      this.services[name] = new Service({
        ...ressources,
        services: this.services,
        models,
      })
    })

    const auras = {}
    _.forEach(GameAuras, (Aura, name) => { auras[name] = Aura })

    this.modules = {}
    _.forEach(GameModules, (Module, name) => {
      this.modules[name] = new Module({
        ...ressources,
        services: this.services,
        modules: this.modules,
        auras,
      })
    })

    this.payloads = {}
    _.forEach(Payloads, (Payload, name) => {
      this.payloads[name] = new Payload({
        ...ressources,
        services: this.services,
      })
    })

    _.forEach(ressources, (ressource, name) => { this[name] = ressource })
  }

  init_renders () {
    return {
      ...Helpers.renders[this.requestType],
    }
  }
}
