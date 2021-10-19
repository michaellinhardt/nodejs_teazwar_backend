import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/discord/command/verifier'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, helpers: h, body: { big_data } } = this
        const { interaction } = big_data

        const default_lang = this.config.language.default
        const discordVerifyArrays = this.lang[default_lang].discord.verify_otp
        const otp = h.string.generateOtp(discordVerifyArrays)

        await s.discords.updateOrCreateOtp(interaction.user, otp)

        await s.socketsInfra.emitSayTwitch(['server_discordbot_verifying', interaction.member.id])
        this.payload.reply = [['command_verify_otp', otp]]
        this.payload.ephemeral = true
      }
    },
  },
]
