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

import ModelSuperclass from './model.superclass'
class EmptyModel extends ModelSuperclass {}

export default class {

  constructor (req, res, twitch) {
    this.build_ressources(req, res, twitch)
  }

  async StopPipeline (error_key = 'unknow_error') {
    const message = this.helpers.language.get(error_key)
    throw new this.renders.StopPipeline(message)
  }

  async identify () {
    const { helpers: h, services: s, renders: r, data: d } = this

    const rawToken = _.get(this, `req.headers['x-access-token']`, null)

    if (rawToken) {
      d.jwtoken = h.jwtoken.extract(this.req)

      const decryptedJwtoken = h.jwtoken.decrypt(d.jwtoken)
  
      d.user_uuid = decryptedJwtoken.user_uuid

      if (d.user_uuid && d.jwtoken) {
        const isUser = await s.users.getBy('uuid', d.user_uuid)
        if (isUser && isUser.jwtoken === d.jwtoken) {
          d.user = isUser
        } else {
          delete d.user_uuid
          delete d.jwtoken
        }
      }
    }
  }

  async identifyChatUser () {
    const { helpers: h, services: s, renders: r, data: d, twitch: t } = this

    if (t.userId) {
      d.user = await s.users.getBy('user_id', t.userId)
      d.user_uuid = _.get(d, 'user.uuid', null)
    } else {
      delete d.user
      delete d.user_uuid
    }

    if (t.userId && t.roomId) {
      d.toon_id = `${t.roomId}_${t.userId}`
      d.toon = await s.toons.getBy('toon_id', d.toon_id)
    }
  }



  async authorizeTeazmod () {
    if (!d.user || !d.user.username !== config.tmiOpts.identify.username) {
      await this.StopPipeline('user.notTeazmod')
    }
  }

  async authorizeAdmin () {
    const { services: s, renders: r, data: d } = this
    const { uuid: user_uuid } = d.user

    d.admin = await s.admins.getBy('user_uuid', user_uuid)

    if (!d.admin) { await this.StopPipeline('router_admin') }
  }

  build_ressources (req, res, twitch) {
    const ressources = {
      req,
      res,
      apis: Apis,
      helpers: _.merge({}, Helpers, GameHelpers),
      data: {},
      twitch,
      db: {},
      payload: {},
      renders: this.init_renders(),
      log: msg => process.stdout.write(`${msg}\n`),
      config: _.merge({}, config, gameConfig),
      lang: Languages,
    }

    const modelRessources = { req, res, helpers: Helpers }

    const models = {}
    _.forEach(Models, (Model, name) => { models[name] = new Model(modelRessources) })

    _.forEach(Services, (Service, name) => {
      if (!models[name]) { models[name] = new EmptyModel(modelRessources) }
    })

    this.services = {}
    _.forEach(Services, (Service, name) => {
      this.services[name] = new Service({
        ...ressources,
        models,
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
      ...Helpers.renders,

      Ok: (payload = null) => Helpers.renders.Ok(this.res, payload || this.payload),
    }
  }
}
