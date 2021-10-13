const _ = require('lodash')
const twitch = require('../../config/files/twitch.config')
const channel = twitch.chatbot.channel

module.exports = {

  extractTwitchData: (twitchData) => {
    const twitch = {}

    twitch.badges = _.get(twitchData, 'userstate.badges', null)
    twitch.color = _.get(twitchData, 'userstate.color', null)
    twitch.displayName = _.get(twitchData, 'userstate.display-name', null)
      || _.get(twitchData, 'userstate.username', null)
    twitch.emotes = _.get(twitchData, 'userstate.emotes', null)
    twitch.mod = _.get(twitchData, 'userstate.mod', null)
    twitch.roomId = _.get(twitchData, 'userstate.room-id', null)
    twitch.subscriber = _.get(twitchData, 'userstate.subscriber', null)
    twitch.turbo = _.get(twitchData, 'userstate.turbo', null)
    twitch.userId = _.get(twitchData, 'userstate.user-id', null)
    twitch.userType = _.get(twitchData, 'userstate.user-type', null)
    twitch.emotesRaw = _.get(twitchData, 'userstate.emotes-raw', null)
    twitch.badgesRaw = _.get(twitchData, 'userstate.badges-raw', null)
    twitch.username = _.get(twitchData, 'userstate.username',
      _.get(twitchData, 'username', null))
    twitch.messageType = _.get(twitchData, 'userstate.message-type', null)

    twitch.message = _.get(twitchData, 'message', null)
    twitch.channel = _.get(twitchData, 'channel', channel)
    twitch.self = _.get(twitchData, 'self', false)

    return twitch
  },

}
