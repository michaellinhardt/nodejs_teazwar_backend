module.exports = {
  endpoint: '/cron',

  sleepWhenCronRouterError: 3000,
  sleepWhenCronTaskError: 1000,

  itvWhenSuccess: 100,
  itvTwitchApiCall: 2,
  tsnTwitchApiCall: 0,

  tsuOnlineTchat: 60 * 3,
  itvOnlineExtension: 60 * 3, // not used yet
  itvTwitchDataRevalidate: 60 * 3, // validate chatters once every..

  itvCheckChatterUnFollow: 60 * 60 * 24,
  itvCheckChatterNewFollower: 60 * 5,
  itvCheckFollowingStatus: 60 * 60 * 24 * 7,

  followingBotsMultiplier: 5, // follow verification timers for bots is increase by xTimes

  tasks: [{
    path: '/chatters/listing',
    isTwitchApi: true,
    itvWhenSuccess: 20,
    itvWhenEmpty: 20,
    itvWhenError: 20,
    // isEnabled: false,
  }, {

    path: '/chatters/validate',
    isTwitchApi: true,
    itvWhenSuccess: 0,
    itvWhenEmpty: 20,
    itvWhenError: 20,
    // isEnabled: false,
  }, {

    path: '/xp/bonus/perma/group',
    isTwitchApi: false,
    itvWhenSuccess: 6,
    itvWhenEmpty: 60,
    itvWhenError: 20,
    // isEnabled: false,
  }, {

    path: '/chatters/xpgain',
    isTwitchApi: false,
    itvWhenSuccess: 0,
    itvWhenEmpty: 20,
    itvWhenError: 20,
    // isEnabled: false,
  }, {

    path: '/xp/levelup',
    isTwitchApi: false,
    itvWhenSuccess: 0,
    itvWhenEmpty: 60,
    itvWhenError: 60,
    // isEnabled: false,
  }, {

    path: '/chatters/bots/update',
    isTwitchApi: false,
    itvWhenSuccess: 60 * 60 * 1,
    itvWhenEmpty: 60 * 60 * 1,
    itvWhenError: 60 * 60 * 1,
    // isEnabled: false,
  }, {

    path: '/chatters/bots/detect',
    isTwitchApi: false,
    itvWhenSuccess: 0,
    itvWhenEmpty: 10,
    itvWhenError: 60 * 5,
    // isEnabled: false,
  }, {

    path: '/chatters/newfollower',
    isTwitchApi: true,
    itvWhenSuccess: 0,
    itvWhenEmpty: 60 * 5,
    itvWhenError: 60 * 5,
    // isEnabled: false,
  }, {

    path: '/chatters/unfollower',
    isTwitchApi: true,
    itvWhenSuccess: 0,
    itvWhenEmpty: 60 * 60 * 12,
    itvWhenError: 60 * 5,
    // isEnabled: false,
  }, {

    path: '/global/following',
    isTwitchApi: true,
    itvWhenSuccess: 0,
    itvWhenEmpty: 60 * 60,
    itvWhenError: 60 * 60,
    // isEnabled: false,
  }],
}
