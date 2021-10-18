import superagent from 'superagent'
import _ from 'lodash'

const {
  discord: { roles, guildId, clientId, token },
  apis: { endpoints },
} = require('../../config')

const membresRoleId = (roles.find(r => r[0] === 'Membres'))[1]

export default {
  addMembresRole: async (discord_id) => {
    const add_role_url
      = `${endpoints.discord}/guilds/${guildId}/members/${discord_id}/roles/${membresRoleId}`
    const response = await superagent
      .put(add_role_url)
      .set('Client-ID', clientId)
      .set('Authorization', `Bot ${token}`)
      .set('Accept', 'application/json')
      .catch((err) => console.error(err))
    return _.get(response, 'body', [])
  },
}
