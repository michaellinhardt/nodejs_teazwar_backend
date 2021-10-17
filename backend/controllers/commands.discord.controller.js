import ControllerSuperclass from '../application/superclass/controller.superclass'

export default [
  {
    isTeazwar: true,
    route: ['post', '/discord/command/verifier'],
    Controller: class extends ControllerSuperclass {
      async handler () {
        const { services: s, helpers: h, body: { interaction } } = this
        const default_lang = this.config.language.default
        const discordVerifyArrays = this.lang[default_lang].discord.verify_otp
        const otp = h.string.generateOtp(discordVerifyArrays)
        await s.discords.updateOrCreateOtp(interaction.user, otp)
        this.payload = {
          say: ['server_discordbot_verifying', interaction.user.id],
          reply: [
            ['command_verify_otp_1'],
            ['command_verify_otp_2', otp],
          ],
          ephemeral: true,
        }

      }
    },
  },
]
