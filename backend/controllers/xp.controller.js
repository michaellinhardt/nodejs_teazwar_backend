import _ from 'lodash'
import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    route: ['post', '/cron/xp/levelup'],
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
]