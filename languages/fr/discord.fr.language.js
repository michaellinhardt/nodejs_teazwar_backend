/* eslint-disable max-len */
module.exports = {
  server_welcome: '[discord.bot] bonjour debug',
  game_welcome: '[discord.bot] bonjour game',
  stream_welcome: '[discord.bot] bonjour stream',
  stats_welcome: '[discord.bot] bonjour stats',

  server_twitchbot_socketConnected: '[twitch.bot] connection socket établi',
  server_twitchbot_twitchConnected: '[twitch.bot] connecté au server irc [0]:[1]',
  server_twitchbot_joined: '[twitch.bot] à rejoin le channel [0] avec le nickname [1]',
  server_twitchbot_leaved: '[twitch.bot] à quitté le channel [0] avec le nickname [1]',

  stream_viewer_joined: '[[1]] à rejoins le stream [0]',
  stream_viewer_leaved: '[[1]] à quitté le stream [0]',

  server_discordbot_socketConnected: '[discord.bot] connection socket établi',
  server_discordbot_slashcommandRegisteredStart: '[discord.bot] envoie des slash /commandes au server discord',
  server_discordbot_slashcommandRegisteredEnd: '[discord.bot] les slash /commandes sont bien enregistré',

  server_discordbot_verifying: '[discord.bot] code de vérification généré pour <@[0]>',

  command_verify_otp_1: '```Pour valider ta vérification, rends toi sur le tchat du stream et tape la commande:```',
  command_verify_otp_2: '!discord [0]',

  verify_otp: [
    ['93', '92', '93', '94', '95', '96', '97', '98', '99', '39', '43', '32', '33', '34', '35', '36', '37', '38', '39', '29', '23', '22', '23', '96'],
    ['AB', 'CD', 'EF', 'GH', 'KP', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV', 'WC', 'YZ', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'JJ', 'KK', 'LL'],
    ['93', '92', '93', '94', '95', '96', '97', '98', '99', '39', '63', '32', '33', '34', '35', '36', '37', '38', '39', '29', '23', '22', '23', '69'],
  ],

}
