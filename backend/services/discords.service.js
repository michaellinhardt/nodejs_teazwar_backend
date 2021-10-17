import ServiceSuperclass from '../application/superclass/service.superclass'

const table = 'discords'

export default class extends ServiceSuperclass {

  constructor (ressources) { super(table, __filename, ressources) }

  async updateOrCreateOtp (discord_user, verify_otp) {
    const discord = await this.getFirstWhere({ discord_id: discord_user.id })
    if (!discord) {
      return this.add({
        verify_otp,
        discord_id: discord_user.id,
        username: discord_user.username,
        discriminator: discord_user.discriminator,
        isBot: !!discord_user.bot,
        isSystem: !!discord_user.system,
        language: discord_user.locale,
      })
    }
    return this.updAllWhere({ discord_id: discord_user.id }, { verify_otp })
  }

}
