module.exports = {
  endpoints: {
    twitch: {
      users: 'https://api.twitch.tv/helix/users',
      follows: 'https://api.twitch.tv/helix/users/follows',
      chatters: 'https://tmi.twitch.tv/group/user/[channel]/chatters',
    },
    twitchinsights: 'https://api.twitchinsights.net/v1/bots/all',
    discord: 'https://discord.com/api/v9',
  },
}

// https://dev.twitch.tv/docs/v5/reference/channels#get-channel-subscribers
