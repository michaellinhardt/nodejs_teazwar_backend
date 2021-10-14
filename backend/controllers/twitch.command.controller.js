import _ from 'lodash'

import ControllerSuperclass from '../application/superclass/controller.superclass'
const { xp, vvs } = require('../../game/config')

export default [
  {
    route: ['post', '/twitch/command/vvs'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s } = this
        const username = _.get(this, 'req.body.twitchData.userstate.[\'display-name\']',
          _.get(this, 'req.body.twitchData.userstate.username', '??'))
        await s.eventsGlobal.addEventForTwitch('say_command_vvs', [ username ])
        r.Ok()
      }
    },
  },
  {
    route: ['post', '/twitch/command/vvstimer'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s } = this
        const username = _.get(this, 'req.body.twitchData.userstate.[\'display-name\']',
          _.get(this, 'req.body.twitchData.userstate.username', '??'))
        await s.eventsGlobal.addEventForTwitch('say_command_vvstimer', [ username, vvs.timerMinutes, vvs.timerMinutesMinimum ])
        r.Ok()
      }
    },
  },
  {
    route: ['post', '/twitch/command/vvv'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s } = this
        const username = _.get(this, 'req.body.twitchData.userstate.[\'display-name\']',
          _.get(this, 'req.body.twitchData.userstate.username', '??'))
        await s.eventsGlobal.addEventForTwitch('say_command_vvv', [ username ])
        r.Ok()
      }
    },
  },
  {
    route: ['post', '/twitch/command/quetes'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s } = this
        const username = _.get(this, 'req.body.twitchData.userstate.[\'display-name\']',
          _.get(this, 'req.body.twitchData.userstate.username', '??'))
        await s.eventsGlobal.addEventForTwitch('say_command_quetes', [ username ])
        r.Ok()
      }
    },
  },
  {
    route: ['post', '/twitch/command/coffre'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s } = this
        const username = _.get(this, 'req.body.twitchData.userstate.[\'display-name\']',
          _.get(this, 'req.body.twitchData.userstate.username', '??'))
        await s.eventsGlobal.addEventForTwitch('say_command_coffre', [ username ])
        r.Ok()
      }
    },
  },
  {
    route: ['post', '/twitch/command/code'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s } = this
        const username = _.get(this, 'req.body.twitchData.userstate.[\'display-name\']',
          _.get(this, 'req.body.twitchData.userstate.username', '??'))
        await s.eventsGlobal.addEventForTwitch('say_command_code', [ username ])
        r.Ok()
      }
    },
  },
  {
    route: ['post', '/twitch/command/xp'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s } = this
        const username = _.get(this, 'req.body.twitchData.userstate.[\'display-name\']',
          _.get(this, 'req.body.twitchData.userstate.username', '??'))
        await s.eventsGlobal.addEventForTwitch('say_command_xp', [
          username,
          xp.xpPerMin,
          xp.xpPerMin * xp.multiplierFollower,
          xp.xpPerMin * xp.multiplierSubscriber,
          xp.mathXpRequis,
        ])
        r.Ok()
      }
    },
  },
  {
    route: ['post', '/twitch/command/xpbonus'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s } = this
        const username = _.get(this, 'req.body.twitchData.userstate.[\'display-name\']',
          _.get(this, 'req.body.twitchData.userstate.username', '??'))
        await s.eventsGlobal.addEventForTwitch('say_command_xpbonus', [
          username,
          xp.multiplierFollower,
          xp.multiplierSubscriber,
          xp.multiplierFollowerGroup * 100 - 100,
          xp.multiplierSubscriberGroup * 100 - 100,
          5,
          2,
          (5 * (xp.multiplierFollowerGroup * 100 - 100)) + (2 * (xp.multiplierSubscriberGroup * 100 - 100)),
        ])
        await s.eventsGlobal.addEventForTwitch('say_command_xpbonus2', [ username ])
          r.Ok()
      }
    },
  },
  {
    route: ['post', '/twitch/command/xprequis'],
    isPublic: false,
    isChannelAdmin: true,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { renders: r, services: s } = this
        const { twitchData = {} } = this.req.body

        const username = _.get(this, 'req.body.twitchData.userstate.[\'display-name\']',
          _.get(this, 'req.body.twitchData.userstate.username', '??'))
        const user_id = _.get(twitchData, 'userstate[\'user-id\']', null)

        if (!user_id) {
          await s.eventsGlobal.addEventForTwitch('say_command_xprequis_unknow', [username])
          return r.Ok()
        }

        const user = await s.users.getByUserId(user_id)
        if (!user) {
          await s.eventsGlobal.addEventForTwitch('say_command_xprequis_unknow', [username])
          return r.Ok()
        }

        const minToLevelUp = s.userXp.calculateMinToLevelUp(user)
        const hourToLevelUp = s.userXp.calculateHourToLevelUp(user)
        const toLevelUp = hourToLevelUp < 1 ? `${minToLevelUp} minutes` : `${hourToLevelUp} heures`

        const isSubscriber = user.isSubscriber === 'yes'
        const isFollower = user.isFollower === 'yes'

        let xprequis_type = null

        let newMinToLevelUp = null
        let newHourToLevelUp = null
        let newToLevelUp = null

        if (!isSubscriber && !isFollower) {
          xprequis_type = 'say_command_xprequis_normal'
          user.isFollower = 'yes'
          newMinToLevelUp = s.userXp.calculateMinToLevelUp(user)
          newHourToLevelUp = s.userXp.calculateHourToLevelUp(user)
          newToLevelUp = newHourToLevelUp < 1 ? `${newMinToLevelUp} minutes` : `${newHourToLevelUp} heures`

        } else if (isFollower && !isSubscriber) {
          xprequis_type = 'say_command_xprequis_follower'
          user.isSubscriber = 'yes'
          newMinToLevelUp = s.userXp.calculateMinToLevelUp(user)
          newHourToLevelUp = s.userXp.calculateHourToLevelUp(user)
          newToLevelUp = newHourToLevelUp < 1 ? `${newMinToLevelUp} minutes` : `${newHourToLevelUp} heures`

        } else if (isSubscriber) { xprequis_type = 'say_command_xprequis_subscriber' }

        await s.eventsGlobal.addEventForTwitch(xprequis_type, [
          username,
          user.level,
          user.level_xp,
          user.level_xp_max,
          toLevelUp,
          newToLevelUp,
        ])

        r.Ok()
      }
    },
  },
]