import superagent from 'superagent'
import _ from 'lodash'

const { twitch, apis: { endpoints } } = require('../../config')

export default {
  getByUsernames: async (chatterUsernames) => {
    const usersUrl = `${endpoints.twitch.users}?login=${chatterUsernames.join('&login=')}`
    const response = await superagent
      .get(usersUrl)
      .set('Client-ID', twitch.clientId)
      .set('Authorization', `Bearer ${twitch.oauth}`)
      .set('Accept', 'application/json')
      .catch((err) => console.error(err))
    return _.get(response, 'body.data', [])
  },
}
