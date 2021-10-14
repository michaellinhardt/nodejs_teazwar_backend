const moment = require('moment')
const { v1 } = require('uuid')
const { teazwarToken } = require('../config/files/jwt.config')

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
    pause: true,
    resume: true,
    xppermin: true,
})

const admins = [
        addAdmin('7e8cc9e0-1c9a-11ec-be7c-2159a9e73249', users[0].uuid),
        addAdmin('7e8cc9e1-1c9a-11ec-be7c-2159a9e73249', users[1].uuid),
]

const events_global = [{
    uuid: v1(),
    event_name: 'database_reseted',
    event_data: '{}'
}]

exports.users = users
exports.admins = admins
exports.events_global = events_global
