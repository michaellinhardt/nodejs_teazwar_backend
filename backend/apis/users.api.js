import superagent from 'superagent'
import _ from 'lodash'

const { twitchApi } = require('../../config')
const users = 'https://api.twitch.tv/helix/users'

export default {
  getByUsernames: async (chatterUsernames) => {
    const usersUrl = `${users}?login=${chatterUsernames.join('&login=')}`
    const response = await superagent
      .get(usersUrl)
      .set('Client-ID', twitchApi.clientId)
      .set('Authorization', `Bearer ${twitchApi.oauth}`)
      .set('Accept', 'application/json')
      .catch((err) => console.error(err))
    return _.get(response, 'body.data', [])
  },
}
