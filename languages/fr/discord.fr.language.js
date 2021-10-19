/* eslint-disable max-len */
module.exports = {
  server_welcome: '🟦 [discord.bot] bonjour debug',
  game_welcome: '🙋 bonjour game',
  stream_welcome: '🙋 bonjour stream',
  stats_welcome: '🙋 bonjour stats',

  server_twitchbot_socketConnected: '🟪 [twitch.bot] connection socket établi',
  server_twitchbot_twitchConnected: '🟪 [twitch.bot] connecté au server irc [0]:[1]',
  server_twitchbot_joined: '🟪 [twitch.bot] à rejoin le channel [0] avec le nickname [1]',
  server_twitchbot_leaved: '🟪 [twitch.bot] à quitté le channel [0] avec le nickname [1]',

  twitch_chatters_listing: '👨‍💻 [0] utilisateurs connecté dans le tchat',
  twitch_chatters_validate_add: '👨‍💻 [0] nouveaux utilisateurs créer avec les données twitch',
  twitch_chatters_validate_update: '👨‍💻 [0] utilisateurs mis à jours avec les données twitch',

  // stream_viewer_joined: '🚪 [[1]] à rejoins le stream [0]',
  // stream_viewer_leaved: '🚪 [[1]] à quitté le stream [0]',
  stream_viewer_joined: '➡️ [.2][[1]] à rejoins le stream [0]',
  stream_viewer_leaved: '⬅️ [.2][[1]] à quitté le stream [0]',
  stream_chatters_bot_added: '🤖 [0] nouveaux bots référencé',
  stream_chatters_bot_deleted: '🤖 [0] bots supprimé de la liste',
  stream_chatters_bot_detected: '🚨  <@[.0]> il y a [1] nouveaux bots détecté: [2]',

  server_discordbot_socketConnected: '🟦 [discord.bot] connection socket établi',
  server_discordbot_slashcommandRegisteredStart: '🟦 [discord.bot] envoie des slash /commandes au server discord',
  server_discordbot_slashcommandRegisteredEnd: '🟦 [discord.bot] les slash /commandes sont bien enregistré',

  server_discordbot_verifying: '🟦 [discord.bot] code de vérification généré pour <@[.0]>',

  debug_discord_report: '[.0] :: [.1]',

  command_description_verifier: 'Génére un code de vérification à copier sur le tchat de twitch pour devenir membre',
  command_description_quete: 'Obtiens des bonus d\'xp et de loot en réalisant cette quête journaliére',
  command_description_commandes: 'Affiche la liste des commandes du server',

  command_verify_otp: '```Pour completer ta vérification, tape cette commande sur le tchat du stream:```\n!discord [.0]\n\n',

  verify_otp: [
    ['33', '32', '33', '34', '95', '96', '97', '98', '99', '39', '43', '32', '33', '34', '35', '36', '37', '38', '39', '29', '23', '22', '23', '96'],
    ['AB', 'CD', 'EF', 'GH', 'KP', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV', 'WC', 'YZ', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'JJ', 'KK', 'LL'],
    ['53', '52', '53', '54', '95', '96', '97', '98', '99', '39', '63', '32', '33', '34', '35', '36', '37', '38', '39', '29', '23', '22', '23', '69'],
  ],

}
