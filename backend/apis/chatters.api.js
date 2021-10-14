import superagent from 'superagent'
import _ from 'lodash'

const { twitch: { chatbot } } = require('../../config')
const chatters = `https://tmi.twitch.tv/group/user/${chatbot.channel}/chatters`
// const chatters = `https://tmi.twitch.tv/group/user/zeldranor/chatters`

export default {
  get: async () => {
    const response = await superagent
      .get(chatters)
      .set('Accept', 'application/json')
      .catch((err) => console.error(err))
    return _.get(response, 'body', {})
  },
}
