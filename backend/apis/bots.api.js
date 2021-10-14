import superagent from 'superagent'
import _ from 'lodash'

const { chatbot } = require('../../config')
const twitchinsights = 'https://api.twitchinsights.net/v1/bots/all'

export default {
  list: async () => {
    const response = await superagent
      .get(twitchinsights)
      .set('Accept', 'application/json')
      .catch(console.error)
    return _.get(response, 'body.bots', [])
  },
}
