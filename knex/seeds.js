// const moment = require('moment')
const _ = require('lodash')
const { v1 } = require('uuid')
const { teazwarToken } = require('../config/files/jwt.config')
const sqlconfig = require('../config/files/sqlconfig.config')

const users = [{
  uuid: '1e8b6bf0-1b50-11ec-85ec-4d033c80c035',
  user_id: '728591707',
  username: 'teazwar',
  display_name: 'TeazWar',
  jwtoken: teazwarToken,
  isSubscriber: 'yes',
  isFollower: 'yes',
  isBot: 'no',
},
{
  uuid: '29e86b60-1b64-11ec-b0db-6ba803c7d2d7',
  user_id: '720229257',
  username: 'teazyou',
  display_name: 'TeazYou',
  isSubscriber: 'yes',
  isFollower: 'yes',
  isBot: 'no',

}]

const addAdmin = (uuid, user_uuid) => ({
  uuid,
  user_uuid,
})

const admins = [
  addAdmin(v1(), users[0].uuid),
  addAdmin(v1(), users[1].uuid),
]

const sockets_infra = [
  { uuid: v1(), infra_name: 'twitch' },
  { uuid: v1(), infra_name: 'discord' },
]

const config = []
_.forEach(sqlconfig, (group, config_group) => {
  _.forEach(group, (config_json, config_key) => config.push({
    config_key,
    config_json: JSON.stringify(config_json),
    config_group,
  }))
})

module.exports = {
  users,
  admins,
  sockets_infra,
  config,
}

