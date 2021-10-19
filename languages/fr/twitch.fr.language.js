/* eslint-disable max-len */
const cfg = require('../../game/config')

const followerXp = `${(cfg.xp.multiplierFollower * 100) - 100}%`
const followerGroupXp = `${cfg.xp.multiplierFollowerGroup * 100}%`

module.exports = {
  welcome: [
    'Hello chat!',
    'Salut tous le monde, je suis de retour!',
    'Je suis là! Rien ne va plus, faite vos jeu!',
    'J\'espère que vous êtes prêts, pars que me re-voila!',
    'Bonjour, bonsoir, je sais même plus..',
  ],

  bot_joined: '🤖 @TeazYou , un bot à rejoins le tchat: @[0]',
  bot_leaved: '🤖 @TeazYou , le bot @[0] à quitté le tchat',

  new_follower: `❤ @[1] merci pour le follow! tu bénéficie maintenant de +${followerXp} XP et le tchat gagne +${followerGroupXp} XP en ta présence 🎉  Si tu as des questions n'hésite pas. @TeazYou`,
  un_follower: '💔 [[1]] je suis triste de te voir un-follow le stream pour la [2] fois et perdre t\'es bonus d\'XP 🥺 Comment puis-je améliorer le stream pour te faire revenir ? @TeazYou',
  re_follower: `❤️‍🩹 [[1]] merci pour ton [2] re-follow, tu bénéficie de nouveau de +${followerXp} XP et le tchat gagne +${followerGroupXp} XP en ta présence 🎉 Qu'es-ce qui ta fais changer d'avis ? @TeazYou`,

  delation_none: '👌 @[0] , je ne détecte aucun bot présent sur le tchat',
  delation_detected: '🤖 @[0] , je détecte [1] bots présent sur le tchat: [2]',

  discord_verfy_noUser: '🙊 Oups, @[0] , ton compte est en cours de création. J\'ai détruit le code que tu viens d\'utiliser. Recommence la procédure depuis discord dans 5 minutes',
  discord_verfy_noOtp: '🙊 Oups, @[0] , je ne trouve aucun code discord associé à ta demande. Vérifie que tu as bien taper le code, ou demande en un nouveau',
  discord_verfy_expired: '🙊 Oups, @[0] , le code à expirè. Il n\'est valide que [1] minutes! Demande en un nouveau sur le discord',

  discord_verified_first: '🥳 Félicition @[0] ! Tu as terminé la quête de vérification discord et des récompense t\'attende en jeu dans ta boite mail',
  discord_verified_notFirst: '👍 Merci, @[0] tu as bien mis à jours t\'es informations discord',

  new_bot_detected: '🚨  @TeazYou il y a [0] nouveaux bots détecté: [1]',

}
