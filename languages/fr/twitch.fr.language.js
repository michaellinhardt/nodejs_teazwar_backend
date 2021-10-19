/* eslint-disable max-len */
const cfg = require('../../game/config')

const followerXp = `${(cfg.xp.multiplierFollower * 100) - 100}%`
const followerGroupXp = `${cfg.xp.multiplierFollowerGroup * 100}%`

module.exports = {
  bot_joined: '🤖 @TeazYou , un bot à rejoins le tchat: @[?]',
  bot_leaved: '🤖 @TeazYou , le bot @[?] à quitté le tchat',

  new_follower: `❤ @[?] merci pour le follow! tu bénéficie maintenant de +${followerXp} XP et le tchat gagne +${followerGroupXp} XP en ta présence 🎉  Si tu as des questions n'hésite pas. @TeazYou`,
  un_follower: '💔 [[?]] je suis triste de te voir un-follow le stream pour la [?] fois et perdre t\'es bonus d\'XP 🥺 Comment puis-je améliorer le stream pour te faire revenir ? @TeazYou',
  re_follower: `❤️‍🩹 [[?]] merci pour ton [?] re-follow, tu bénéficie de nouveau de +${followerXp} XP et le tchat gagne +${followerGroupXp} XP en ta présence 🎉 Qu'es-ce qui ta fais changer d'avis ? @TeazYou`,

  delation_none: '👌 @[?] , je ne détecte aucun bot présent sur le tchat',
  delation_detected: '🤖 @[?] , je détecte [?] bots présent sur le tchat: [?]',

  level_up_one: '✨ LVL UP =[ @[?] [?] ]=',
  level_up_multi: '✨ LVL UP [?]',

  discord_verfy_noUser: '🙊 Oups, @[?] , ton compte est en cours de création. J\'ai détruit le code que tu viens d\'utiliser. Recommence la procédure depuis discord dans 5 minutes',
  discord_verfy_noOtp: '🙊 Oups, @[?] , je ne trouve aucun code discord associé à ta demande. Vérifie que tu as bien taper le code, ou demande en un nouveau',
  discord_verfy_expired: '🙊 Oups, @[?] , le code à expirè. Il n\'est valide que [?] minutes! Demande en un nouveau sur le discord',

  discord_verified_first: '🥳 Félicition @[?] ! Tu as terminé la quête de vérification discord et des récompense t\'attende en jeu dans ta boite mail',
  discord_verified_notFirst: '👍 Merci, @[?] tu as bien mis à jours t\'es informations discord',

  new_bot_detected: '🚨  @TeazYou il y a [?] nouveaux bots détecté: [?]',

  // bot_joined: '🤖 @TeazYou , un bot à rejoins le tchat: @[0]',
  // bot_leaved: '🤖 @TeazYou , le bot @[0] à quitté le tchat',

  // new_follower: `❤ @[0] merci pour le follow! tu bénéficie maintenant de +${followerXp} XP et le tchat gagne +${followerGroupXp} XP en ta présence 🎉  Si tu as des questions n'hésite pas. @TeazYou`,
  // un_follower: '💔 [[0]] je suis triste de te voir un-follow le stream pour la [1] fois et perdre t\'es bonus d\'XP 🥺 Comment puis-je améliorer le stream pour te faire revenir ? @TeazYou',
  // re_follower: `❤️‍🩹 [[0]] merci pour ton [1] re-follow, tu bénéficie de nouveau de +${followerXp} XP et le tchat gagne +${followerGroupXp} XP en ta présence 🎉 Qu'es-ce qui ta fais changer d'avis ? @TeazYou`,

  // delation_none: '👌 @[0] , je ne détecte aucun bot présent sur le tchat',
  // delation_detected: '🤖 @[0] , je détecte [1] bots présent sur le tchat: [2]',

  // level_up_one: '✨ @[0] level up [1]',
  // level_up_multi: '✨ level up: [0]',

  // discord_verfy_noUser: '🙊 Oups, @[0] , ton compte est en cours de création. J\'ai détruit le code que tu viens d\'utiliser. Recommence la procédure depuis discord dans 5 minutes',
  // discord_verfy_noOtp: '🙊 Oups, @[0] , je ne trouve aucun code discord associé à ta demande. Vérifie que tu as bien taper le code, ou demande en un nouveau',
  // discord_verfy_expired: '🙊 Oups, @[0] , le code à expirè. Il n\'est valide que [1] minutes! Demande en un nouveau sur le discord',

  // discord_verified_first: '🥳 Félicition @[0] ! Tu as terminé la quête de vérification discord et des récompense t\'attende en jeu dans ta boite mail',
  // discord_verified_notFirst: '👍 Merci, @[0] tu as bien mis à jours t\'es informations discord',

  // new_bot_detected: '🚨  @TeazYou il y a [0] nouveaux bots détecté: [1]',

}
