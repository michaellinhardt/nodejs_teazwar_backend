import superagent from 'superagent'
import _ from 'lodash'

const { apis: { endpoints } } = require('../../config')

export default {
  list: async () => {
    const response = await superagent
      .get(endpoints.twitchinsights)
      .set('Accept', 'application/json')
      .catch(console.error)
    const botList = _.get(response, 'body.bots', []).filter(b => b[0].toLowerCase() !== 'teazyou')
    return botList
  },
}
