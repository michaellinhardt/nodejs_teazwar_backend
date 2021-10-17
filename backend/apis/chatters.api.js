import superagent from 'superagent'
import _ from 'lodash'

const { twitch: { chatbot }, apis: { endpoints } } = require('../../config')
const endpoint = endpoints.twitch.chatters.replace('[channel]', chatbot.channel)

export default {
  get: async () => {
    const response = await superagent
      .get(endpoint)
      .set('Accept', 'application/json')
      .catch((err) => console.error(err))
    return _.get(response, 'body', {})
  },
}
