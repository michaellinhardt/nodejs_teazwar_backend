const { xp } = require('../../config')

module.exports = {

  xpPerMin: xp.xpPerMin,
  xpPerMinFollower: xp.xpPerMin * xp.multiplierFollower,
  xpPerMinSubscriber: xp.xpPerMin * xp.multiplierSubscriber,

  xpRequired: level => parseInt((xp.xpPerMin * 5) + (level * 100 * (level / 10)), 10),

}

