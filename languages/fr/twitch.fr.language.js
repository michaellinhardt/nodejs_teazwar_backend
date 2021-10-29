/* eslint-disable max-len */
const { xp } = require('../../game/config')

module.exports = {
  bot_joined: '🤖 @TeazYou , un bot à rejoins le tchat: @[?]',
  bot_leaved: '🤖 @TeazYou , le bot @[?] à quitté le tchat',

  xpbonus_perma_group: '🤜🤛 XP Bonus Group [?]%',

  new_follower: `❤ @[?] merci pour le follow! tu as maintenant +${xp.follower.self}% XP et le tchat gagne +${xp.follower.group}% XP en ta présence 🎉  Une récompense t'attends également dans t'es courrier TeazWar 🎁  Si tu as des questions n'hésite pas. @TeazYou`,
  un_follower: '💔 [[?]] je suis triste de te voir dé-follow le stream pour la [?] fois et perdre t\'es bonus d\'XP 🥺 Comment puis-je améliorer le stream pour te faire revenir ? @TeazYou',
  re_follower: `❤️ [[?]] merci pour ton [?] re-follow, tu bénéficie de nouveau de +${xp.follower.self} XP et le tchat gagne +${xp.follower.group} XP en ta présence 🎉 Qu'es-ce qui ta fais changer d'avis ? @TeazYou`,

  delation_none: '👌 @[?] , je ne détecte aucun bot présent sur le tchat',
  delation_detected: '🤖 @[?] , je détecte [?] bots présent sur le tchat: [?]',

  level_up_one: '✨ =[ @[?] [?] ]=',
  level_up_multi: '✨ =[?]=',

  discord_verfy_noUser: '🙊 Oups, @[?] , ton compte est en cours de création. J\'ai détruit le code que tu viens d\'utiliser. Recommence la procédure depuis discord dans 5 minutes',
  discord_verfy_noOtp: '🙊 Oups, @[?] , je ne trouve aucun code discord associé à ta demande. Vérifie que tu as bien taper le code, ou demande en un nouveau',
  discord_verfy_expired: '🙊 Oups, @[?] , le code à expirè. Il n\'est valide que [?] minutes! Demande en un nouveau sur le discord',

  discord_verified_first: `🥳 Félicition @[?] et merci d'avoir vérifié ton compte discord ! Tu as maintenant +${xp.discord.self}% XP et le tchat gagne +${xp.discord.group}% XP en ta présence 🎉' Aussi, une récompense t'attends dans t'es courrier TeazWar 🎁  Si tu as des questions n'hésite pas. @TeazYou`,
  discord_verified_notFirst: '👍 Merci, @[?] tu as bien mis à jours t\'es informations discord',

  new_bot_detected: '🚨  @TeazYou il y a [?] nouveaux bots détecté: [?]',

}
