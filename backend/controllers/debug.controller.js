import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/debug/discord/report'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this
        if (!b.errorArray || !Array.isArray(b.errorArray)) {
          return false
        }
        await s.socketsInfra.emitError(b.errorArray)
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/debug/redis/connected'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this
        await s.socketsInfra.emitSayDiscord(['server_redis_connected', b.infra_name])
      }
    },
  },
  {
    isTeazwar: true,
    route: ['post', '/debug/socket-redis/connected'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, body: b } = this
        await s.socketsInfra.emitSayDiscord(['server_socket_redis_connected', b.infra_name])
      }
    },
  },
]
