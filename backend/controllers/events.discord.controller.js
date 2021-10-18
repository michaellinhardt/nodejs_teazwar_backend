// import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/discord/message'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { body: { big_data: { message } }, config } = this
        const { discord: { chatbot, bot_discord_user_id, bienvenue_message_id } } = config

        const {
          channelId,
          deleted,
          // guildId,
          // createdTimestamp,
          // type,
          // system,
          // content,
          author,
        } = message

        if (bot_discord_user_id === author.id) { return true }
        const bievenueChannelId = (chatbot.channels.find(c => c[0] === 'bienvenue'))[1]

        if (channelId === bievenueChannelId && !deleted && message.id !== bienvenue_message_id) {
          await message.delete()
        }
      }
    },
  },
]
