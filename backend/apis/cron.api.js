import superagent from 'superagent'
import _ from 'lodash'

const { cron, chatbot } = require('../../config')

export default {
  self: async (task_path) => {
    const payload = {
        success: false,
        empty: true,
    }
    try {
        const response = await superagent
            .post(`${cron.endpoint}${task_path}`)
            .set('x-access-token', chatbot.bearer)
            .set('Accept', 'application/json')
            .catch(console.error)
        payload.success = _.get(response, 'body.success', false)
        payload.empty = _.get(response, 'body.empty', true)
    } catch (err) { console.error(err) }
    return payload
  },
}
