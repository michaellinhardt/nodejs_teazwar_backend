import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    route: ['post', '/cron/router'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {

          const cron = await s.cronTasks.buildCronObject()

          const task = s.cronTasks.getNextTask(cron)
          if (!task) {
            this.payload = p.cron.empty()
            return true
          }

          this.payload = p.cron.success({ cron, task })
          return true

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
          return true
        }
      }
    },
  },
  {
    route: ['post', '/cron/interval'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, body: b } = this
        try {

          await s.cronTasks.setTwitchApiNext(b.cron, b.task)
          await s.cronTasks.setTaskInterval(b.task, b.taskResult)

          this.payload = p.cron.success()
          return true

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
          return true
        }
      }
    },
  },
  {
    route: ['post', '/cron/chatters/listing'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {
  
          const chatters = await a.chatters.get()

          // const chatters_count = s.chatters.getCountFromTwitch(chatters)
          // await s.eventsGlobal.addEventForDiscord('chatters_count', { chatters_count })

          const chatter_list = s.chatters.getChattersFromTwitch(chatters)
  
          await s.chatters.addOrIncrement(chatter_list)

          await s.users.setOnline(chatter_list)
          
          this.payload = p.cron.success()
          return true

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
          return false
        }
      }
    },
  },
  {
    route: ['post', '/cron/chatters/validate'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {
  
          const chatters = await s.chatters.getNextValidateList()

          if (chatters.length === 0) {
            this.payload = p.cron.empty()
            return true
          }

          const chatterUsernames = chatters.map(c => c.username)

          const twitchUsers = await a.users.getByUsernames(chatterUsernames)

          const users = await s.users.addOrUpdate(twitchUsers)
          const allUsers = users.added.concat(users.updated)

          await s.userXp.addMissingEntry(allUsers)
          await s.userChat.addMissingEntry(allUsers)
          await s.userAttributes.addMissingEntry(allUsers)

          const chatters_xp_gains = await s.userXp.addXpGain(allUsers, chatters)
          // await s.eventsGlobal.addEventForDiscord('chatters_xp_gains', { chatters_xp_gains })

          const allUserUsernames = allUsers.map(u => u.username)

          await s.chatters.resetByUsernames(allUserUsernames)

          this.payload = p.cron.success()

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
        }
        return true
      }
    },
  },
  {
    route: ['post', '/cron/userxp/levelup'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {
  
          const requireLevelUp = await s.userXp.getRequireLevelUp()

          if (requireLevelUp.length === 0) {
            this.payload = p.cron.empty()
            return true
          }

          await s.userXp.increaseLevel(requireLevelUp)

          // await s.eventsGlobal.addEventForDiscord('chatters_level_up', { chatters_level_up: requireLevelUp.length })

          this.payload = p.cron.success()

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
        }
        return true
      }
    },
  },
  {
    route: ['post', '/cron/bots/detect'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {
  
          const botsList = await a.bots.list()

          const taggedBots = await s.users.tagBots(botsList)

          if (taggedBots.length) {
            // await s.eventsGlobal.addEvent('chatters_bots_detected', { chatters_bots_detected: taggedBots })
          }

          this.payload = !taggedBots.length ? p.cron.empty() : p.cron.success()

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
        }
        return true
      }
    },
  },
  {
    route: ['post', '/cron/global/following'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {

          const channel = await s.users.getChannel()
          const user = await s.users.getOneGlobalFollowing()

          if (!channel || !user) {
            this.payload = p.cron.empty()
            return true
          }

          const isFollowing = await a.follows.check(channel.user_id, user.user_id)

          if (user.isFollower === 'maybe'
            || (user.isFollower === 'no' && isFollowing.length)
            || (user.isFollower === 'yes' && !isFollowing.length)) {
            const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
            // await s.eventsGlobal.addEvent('global_following_change', { 
            //   countFollow,
            //   username: user.username,
            //   previous: user.isFollower,
            //   current: (isFollowing.length > 0) })
            }

          await s.users.updateFollowing(user, isFollowing)

          this.payload = p.cron.success()

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
        }
        return true
      }
    },
  },
  {
    route: ['post', '/cron/chatters/unfollower'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {

          const channel = await s.users.getChannel()
          const user = await s.users.getOneChatterUnFollower()

          if (!channel || !user) {
            this.payload = p.cron.empty()
            return true
          }

          const isFollowing = await a.follows.check(channel.user_id, user.user_id)

          if (user.isFollower === 'maybe'
            || (user.isFollower === 'no' && isFollowing.length)
            || (user.isFollower === 'yes' && !isFollowing.length)) {
            const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
            // await s.eventsGlobal.addEvent('chatters_un_follower', { 
            //   countFollow,
            //   username: user.username,
            //   previous: user.isFollower,
            //   current: (isFollowing.length > 0) })
            }

          await s.users.updateFollowing(user, isFollowing)

          this.payload = p.cron.success()

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
        }
        return true
      }
    },
  },
  {
    route: ['post', '/cron/chatters/newfollower'],
    isPublic: false,
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, payloads: p, apis: a } = this
        try {

          const channel = await s.users.getChannel()
          const user = await s.users.getOneChatterNewFollower()

          if (!channel || !user) {
            this.payload = p.cron.empty()
            return true
          }

          const isFollowing = await a.follows.check(channel.user_id, user.user_id)

          if (user.isFollower === 'maybe'
            || (user.isFollower === 'no' && isFollowing.length)
            || (user.isFollower === 'yes' && !isFollowing.length)) {
            const countFollow = isFollowing.length > 0 ? user.countFollow + 1 : user.countFollow
            // await s.eventsGlobal.addEvent('chatters_new_follower', { 
            //   countFollow,
            //   username: user.username,
            //   previous: user.isFollower,
            //   current: (isFollowing.length > 0) })
            }

          await s.users.updateFollowing(user, isFollowing)

          this.payload = p.cron.success()

        } catch (err) {
          console.error(err)
          this.payload = p.cron.error()
        }
        return true
      }
    },
  },
]