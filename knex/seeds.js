const _ = require('lodash')
const cron = require('../config/files/cron.config')
const sqlconfig = require('../config/files/sqlconfig.config')
const jwt = require('../config/files/jwt.config')

const users = [{
  user_uuid: '1e8b6bf0-1b50-11ec-85ec-4d033c80c035',
  user_id: '728591707',
  username: 'teazwar',
  display_name: 'TeazWar',
  jwtoken: jwt.teazwarToken,
  isSubscriber: 'yes',
  // isFollower: 'yes',
  isBot: 'no',
},
{
  user_uuid: '29e86b60-1b64-11ec-b0db-6ba803c7d2d7',
  user_id: '720229257',
  username: 'teazyou',
  display_name: 'TeazYou',
  isSubscriber: 'yes',
  // isFollower: 'yes',
  isBot: 'no',

}]

const admins = [
  { user_uuid: users[0].user_uuid },
  { user_uuid: users[1].user_uuid },
]

const config = []
_.forEach(sqlconfig, (group, config_group) => {
  _.forEach(group, (config_json, config_key) => config.push({
    config_key,
    config_json: JSON.stringify(config_json),
    config_group,
  }))
})

const cron_tasks = cron.tasks
  .map(c => ({ path: c.path }))
cron_tasks.unshift({ path: 'twitch' })

const user_sub_tables = [{ user_uuid: users[0].user_uuid }, { user_uuid: users[1].user_uuid }]

module.exports = {
  users,
  admins,
  config,
  user_sub_tables,
  cron_tasks,
}

