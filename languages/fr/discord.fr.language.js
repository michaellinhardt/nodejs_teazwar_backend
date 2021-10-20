/* eslint-disable max-len */
module.exports = {
  server_welcome: '🟦 [discord.bot] bonjour debug',
  game_welcome: '🙋 bonjour game',
  stream_welcome: '🙋 bonjour stream',
  stats_welcome: '🙋 bonjour stats',
  spam_welcome: '🙋 bonjour spam',
  debug_welcome: '🙋 bonjour debug',

  game_xpbonus_perma_group: '👨‍👩‍👧‍👦 xp bonus de group recalculé à [?]% ( [.?] )',

  server_twitchbot_socketConnected: '🟪 [twitch.bot] connection socket établi',
  server_twitchbot_socketDisconnected: '🟪 [twitch.bot] socket déconnecté: [?]',
  server_twitchbot_twitchConnected: '🟪 [twitch.bot] connecté au server irc [?]:[?]',
  server_twitchbot_joined: '🟪 [twitch.bot] à rejoin le tchat avec le nickname [?]',
  server_twitchbot_leaved: '🟪 [twitch.bot] à quitté le tchat avec le nickname [?]',

  spam_chatters_listing: '👨‍💻 [?] utilisateurs sur le tchat: [?]',

  stream_chatters_validate_add: '👨‍💻 [?] nouveaux utilisateurs: [?]',
  stream_chatters_validate_update: '👨‍💻 [?] utilisateurs mis à jours: [?]',

  stream_viewer_joined: '➡️ [.?][[?]] à rejoins le tchat twitch',
  stream_viewer_leaved: '⬅️ [.?][[?]] à quitté le tchat twitch',
  stream_bot_joined: '🤖 <@[.?]> un bot à rejoins le tchat twitch: [?]',
  stream_bot_leaved: '🤖 <@[.?]> un bot à quitté le tchat twitch: [?]',

  stream_new_follower: '❤ [.?][[?]] est un nouveau follower du stream',
  stream_un_follower: '💔 [.?][[?]] ne follow plus le stream pour la [?] fois',
  stream_re_follower: '❤️‍🩹 [.?][[?]] re-follow le stream pour la [?] fois',

  stream_chatters_bot_added: '🤖 [?] nouveaux bots référencé',
  stream_chatters_bot_deleted: '🤖 [?] bots supprimé de la liste',
  stream_chatters_bot_detected: '🚨  <@[.?]> il y a [?] nouveaux bots détecté: [?]',

  game_level_up_one: '✨ LVL UP =[ [.?] [.?] [.?] ]=',
  game_level_up_multi: '✨ LVL UP [.?]',

  server_discordbot_socketConnected: '🟦 [discord.bot] connection socket établi',
  server_discordbot_socketDisconnected: '🟦 [discord.bot] socket déconnecté: [?]',
  server_discordbot_slashcommandRegisteredStart: '🟦 [discord.bot] envoie des slash /commandes au server discord',
  server_discordbot_slashcommandRegisteredEnd: '🟦 [discord.bot] les slash /commandes sont bien enregistré',

  server_discordbot_verifying: '🟦 [discord.bot] code de vérification généré pour <@[.?]>',

  debug_discord_report: '🪲 [.?] ➡️ [.?]',

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
