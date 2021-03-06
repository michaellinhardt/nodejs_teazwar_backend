/* eslint-disable max-len */
const config = require('../../config')
const cfgGame = require('../../game/config')

module.exports = {
  server_welcome: '🟦 [discord.bot] bonjour debug',
  game_welcome: '🙋 bonjour game',
  stream_welcome: '🙋 bonjour stream',
  stats_welcome: '🙋 bonjour stats',
  spam_welcome: '🙋 bonjour spam',
  debug_welcome: '🙋 bonjour debug',

  stream_unregistered_cutscene_exit: '🎬 un utilisateur à terminé la cutscene [?]',
  stream_registered_cutscene_exit: '🎬 [?] à terminé la cutscene [?]',

  stream_deconnection_unregistered: '🎮 un utilisateur s\'est déconnecté de TeazWar',
  stream_deconnection_registered: '🎮 [[?]] s\'est déconnecté de TeazWar',
  stream_connection_unregistered: '🎮 un utilisateur s\'est connecté sur TeazWar',
  stream_connection_registered: '🎮 [[?]] s\'est connecté sur TeazWar',

  game_xpbonus_perma_group: '👨‍👩‍👧‍👦 xp bonus de group recalculé à [?]% ( [.?] )',

  server_twitchbot_socketConnected: '🟪 [twitch.bot] connection socket établi',
  server_twitchbot_socketDisconnected: '🟪 [twitch.bot] socket déconnecté: [?]',
  server_twitchbot_twitchConnected: '🟪 [twitch.bot] connecté au server irc [?]:[?]',
  server_twitchbot_joined: '🟪 [twitch.bot] à rejoin le tchat twitch',
  server_twitchbot_leaved: '🟪 [twitch.bot] à quitté le tchat twitch',

  server_redis_connected: '💾 [redis.server] nouvelle connection de [?]',
  server_socket_redis_connected: '☎ [socket.redis.adapter] liaison établi par: [?]',

  spam_chatters_listing: '👨‍💻 [?] utilisateurs sur le tchat: [?]',
  spam_xp_chatline: `🥳 +${cfgGame.xp.xpPerChatLine} XP pour tous les viewer de la part de [[?]]`,
  spam_xpbonus_multipliers: '🎂 XP bonus multiplicatif de groupe [.?]',

  stream_aura_create: '🌕 création de l\'aura [[?]] pour [.?][[?]]',
  stream_aura_delete: '🌑 supression de l\'aura [[?]] pour [.?][[?]]',

  stream_extension_validate_account: '👨‍💻 [?] à créer son compte via l\'extension',
  stream_chatters_validate_add: '👨‍💻 [?] nouveaux utilisateurs détecté sur le tchat: [?]',
  stream_chatters_validate_update: '👨‍💻 [?] utilisateurs mis à jours depuis le tchat: [?]',

  stream_viewer_joined: '➡️ [.?][[?]] à rejoins le tchat twitch',
  stream_viewer_leaved: '⬅️ [.?][[?]] à quitté le tchat twitch',
  stream_bot_joined: '🤖 <@[.?]> un bot à rejoins le tchat twitch: [?]',
  stream_bot_leaved: '🤖 <@[.?]> un bot à quitté le tchat twitch: [?]',

  stream_new_follower: '❤ [.?][[?]] est un nouveau follower du stream',
  stream_un_follower: '💔 [.?][[?]] ne follow plus le stream pour la [?] fois',
  stream_re_follower: '❤️ [.?][[?]] re-follow le stream pour la [?] fois',

  stream_chatters_bot_added: '🤖 [?] nouveaux bots référencé',
  stream_chatters_bot_deleted: '🤖 [?] bots supprimé de la liste',
  stream_chatters_bot_detected: '🚨  <@[.?]> il y a [?] nouveaux bots détecté: [?]',

  game_level_up_one: '✨ LVL UP =[ [.?] [.?] [.?] ]=',
  game_level_up_multi: '✨ LVL UP =[.?]=',

  server_discordbot_socketConnected: '🟦 [discord.bot] connection socket établi',
  server_discordbot_socketDisconnected: '🟦 [discord.bot] socket déconnecté: [?]',
  server_discordbot_slashcommandRegisteredStart: '🟦 [discord.bot] envoie des slash /commandes au server discord',
  server_discordbot_slashcommandRegisteredEnd: '🟦 [discord.bot] les slash /commandes sont bien enregistré',

  server_discordbot_verifying: '🟦 [discord.bot] code de vérification généré pour <@[.?]>',
  server_chatters_clean: '⏱ [cron.server] nettoyage SQL de [?] \'chatters\'',
  server_auras_clean: '⏱ [cron.server] nettoyage SQL de [?] \'auras\'',
  server_strangers_clean: '⏱ [cron.server] nettoyage SQL de [?] \'strangers\'',

  debug_discord_report: `🪲 <@${config.discord.teazyou_discord_user_id}> [.?] ➡️ [.?]`,

  command_description_verifier: 'Génére un code de vérification à copier sur le tchat de twitch pour devenir membre',
  command_description_quete: 'Obtiens des bonus d\'xp et de loot en réalisant cette quête journaliére',
  command_description_commandes: 'Affiche la liste des commandes du server',

  command_verify_otp: '```Pour completer ta vérification, tape cette commande sur le tchat du stream:```\n!discord [.?]\n\n',

  verify_otp: [
    ['33', '32', '33', '34', '95', '96', '97', '98', '99', '39', '43', '32', '33', '34', '35', '36', '37', '38', '39', '29', '23', '22', '23', '96'],
    ['AB', 'CD', 'EF', 'GH', 'KP', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV', 'WC', 'YZ', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'JJ', 'KK', 'LL'],
    ['53', '52', '53', '54', '95', '96', '97', '98', '99', '39', '63', '32', '33', '34', '35', '36', '37', '38', '39', '29', '23', '22', '23', '69'],
  ],

}
