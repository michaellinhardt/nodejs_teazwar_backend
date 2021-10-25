import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'discords'
const uuid_field = false

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources, uuid_field) }

  updateOrCreateOtp (discord_user, verify_otp) {
    const { helpers: h, config: { discord: { itvDiscordOtpValidity } } } = this

    const tsuDiscordOtpValid = h.date.timestampMs() + itvDiscordOtpValidity

    const addOrUpdate = {
      verify_otp,
      discord_id: discord_user.id,
      discord_username: discord_user.username,
      discord_discriminator: discord_user.discriminator,
      isBot: !!discord_user.bot,
      isSystem: !!discord_user.system,
      tsuDiscordOtpValid,
    }

    return this.addOrUpd(addOrUpdate)
  }

  getByOtp (verify_otp) {
    return this.getLastWhere({ verify_otp })
  }

  validateByOtp (verify_otp) {
    const currTimestampMs = this.helpers.date.timestampMs()
    return this.updAllWhere({ verify_otp }, {
      verify_otp: null,
      tslDiscordOtpValidated: currTimestampMs,
    })
  }

  deleteOtpByOtp (verify_otp) {
    return this.updAllWhere({ verify_otp }, { verify_otp: null })
  }

}
