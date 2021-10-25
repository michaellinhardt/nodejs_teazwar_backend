const {
  msOneMin,
} = require('../../../helpers/files/date.helper')

const xpPerMin = 100

module.exports = {
  startLevel: 1,

  xpPerMin,

  xpMaxMinimum: xpPerMin * 5,

  xpPerChatLine: 1,
  itvPerChatLine: msOneMin,

  follower: {
    group: 1,
    self: 50,
  },
  discord: {
    group: 1,
    self: 50,
  },
  subscriber: {
    group: 1,
    self: 50,
  },

}
