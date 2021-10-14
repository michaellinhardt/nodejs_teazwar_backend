import superagent from 'superagent'
import _ from 'lodash'

const { twitch, apis: { endpoints } } = require('../../config')

export default {
  check: async (channel_id, target_id) => {
    const followsUrl = `${endpoints.twitch.follows}?to_id=${channel_id}&from_id=${target_id}`
    const response = await superagent
      .get(followsUrl)
      .set('Client-ID', twitch.clientId)
      .set('Authorization', `Bearer ${twitch.oauth}`)
      .set('Accept', 'application/json')
      .catch((err) => console.error(err))
    return _.get(response, 'body.data', [])
  },
}
