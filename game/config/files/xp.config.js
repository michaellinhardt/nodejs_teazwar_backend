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
    new: {
      charge: 60,
      group: 10,
    },
    group: 1,
    self: 50,
  },
  discord: {
    new: {
      charge: 60,
      group: 10,
    },
    group: 1,
    self: 50,
  },
  subscriber: {
    new: {
      charge: 60,
      group: 10,
    },
    group: 1,
    self: 50,
  },

}
