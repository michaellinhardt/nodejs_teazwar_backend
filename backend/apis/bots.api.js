import superagent from 'superagent'
import _ from 'lodash'

const { apis: { endpoints } } = require('../../config')

export default {
  list: async () => {
    const response = await superagent
      .get(endpoints.twitchinsights)
      .set('Accept', 'application/json')
      .catch(console.error)
    return _.get(response, 'body.bots', [])
  },
}
