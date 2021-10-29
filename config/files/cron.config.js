const {
  msOneSec, msOneMin, msOneHour, msOneDay, msOneMonth,
} = require('../../helpers/files/date.helper')

module.exports = {
  endpoint: '/cron',

  sleepWhenCronRouterError: msOneSec,
  sleepWhenCronTaskError: msOneSec,

  itvNothingTosay: 300,
  itvSayDiscord: 500,
  itvSayTwitch: 1000,

  itvWhenSuccess: 100,
  itvTwitchApiCall: msOneSec * 2,
  tsnTwitchApiCall: 0,

  itvOnlineTchat: msOneMin * 3,
  itvOnlineExtension: msOneMin * 3,
  itvTwitchDataRevalidate: msOneMin * 3,

  itvCheckChatterUnFollow: msOneDay,
  itvCheckChatterNewFollower: msOneMin * 5,

  itvStrangerDelete: msOneMonth * 3,

  itvFollowingBotsMultiplier: 5,

  tasks: [{
    path: '/chatters/listing',
    isTwitchApi: true,
    itvWhenSuccess: msOneSec * 20,
    itvWhenEmpty: msOneSec * 20,
    itvWhenError: msOneSec * 20,
    // isEnabled: false,
  }, {

    path: '/chatters/validate',
    isTwitchApi: true,
    itvWhenSuccess: 0,
    itvWhenEmpty: msOneSec * 5,
    itvWhenError: msOneSec * 5,
    // isEnabled: false,
  }, {

    path: '/xp/bonus/perma/group',
    isTwitchApi: false,
    itvWhenSuccess: msOneSec * 5,
    itvWhenEmpty: msOneSec * 5,
    itvWhenError: msOneSec * 5,
    // isEnabled: false,
  }, {

    path: '/chatters/xpgain',
    isTwitchApi: false,
    itvWhenSuccess: 0,
    itvWhenEmpty: msOneSec * 5,
    itvWhenError: msOneSec * 5,
    // isEnabled: false,
  }, {

    path: '/xp/levelup',
    isTwitchApi: false,
    itvWhenSuccess: 0,
    itvWhenEmpty: msOneSec * 5,
    itvWhenError: msOneSec * 5,
    // isEnabled: false,
  }, {

    path: '/chatters/bots/update',
    isTwitchApi: false,
    itvWhenSuccess: msOneHour,
    itvWhenEmpty: msOneHour,
    itvWhenError: msOneHour,
    // isEnabled: false,
  }, {

    path: '/chatters/bots/detect',
    isTwitchApi: false,
    itvWhenSuccess: 0,
    itvWhenEmpty: msOneSec * 10,
    itvWhenError: msOneMin * 5,
    // isEnabled: false,
  }, {

    path: '/chatters/newfollower',
    isTwitchApi: true,
    itvWhenSuccess: 0,
    itvWhenEmpty: msOneMin * 5,
    itvWhenError: msOneMin * 5,
    // isEnabled: false,
  }, {

    path: '/chatters/unfollower',
    isTwitchApi: true,
    itvWhenSuccess: 0,
    itvWhenEmpty: msOneHour * 12,
    itvWhenError: msOneMin * 5,
    // isEnabled: false,
  }, {

    path: '/chatters/clean',
    isTwitchApi: false,
    itvWhenSuccess: 0,
    itvWhenEmpty: msOneDay,
    itvWhenError: msOneDay,
    // isEnabled: false,
  }, {

    path: '/auras/clean',
    isTwitchApi: false,
    itvWhenSuccess: 0,
    itvWhenEmpty: msOneDay,
    itvWhenError: msOneDay,
    // isEnabled: false,
  }, {

    path: '/strangers/clean',
    isTwitchApi: false,
    itvWhenSuccess: 0,
    itvWhenEmpty: msOneDay,
    itvWhenError: msOneDay,
    // isEnabled: false,
  }],
}
