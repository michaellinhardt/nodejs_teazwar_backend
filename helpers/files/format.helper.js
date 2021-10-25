module.exports = {

  userTwitchLevlUp: ({ display_name, level }) => `[ @${display_name} ${level} ]`,
  userDiscordLevlUp: ({ discord_id, display_name, level }) =>
    `[ ${(discord_id ? `<@${discord_id}> ` : '')}${display_name} ${level} ]`,
  userDiscordPing: (user = {}) => user && user.discord_id ? ` <@${user.discord_id}> ` : '',

  xpBonusGroupDetails: ({ follower, discord, subscriber }) =>
    `${follower} Fol. ${subscriber} Sub. ${discord} Disc.`,

  xpBonusMultipliers: (multipliersReport) =>
    `=${multipliersReport.map(m => `[ +${m.multiplier}% ${m.display_name} ]`).join('=')}=`,

}
