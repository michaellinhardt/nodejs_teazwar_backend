module.exports = {

  userTwitchLevlUp: ({ display_name, level }) => `=[ @${display_name} ${level} ]=`,
  userDiscordLevlUp: ({ discord_id, display_name, level }) =>
    `=[ ${(discord_id ? `<@${discord_id}> ` : '')}${display_name} ${level} ]=`,
  userDiscordPing: (user = {}) => user && user.discord_id ? ` <@${user.discord_id}> ` : '',

}
