module.exports = {
  code: 'ZPSZd4UJHby64JaSS4nhqqw9Sqfq7s', // ??
  token: 'ODkwMzk4NTA4NTI2NDg5Njcw.YUvOOw.6fwHa3FYSqoReOwBDpHZxN9Me3g',
  clientId: '890398508526489670',
  guildId: '879871370383724576',

  sleepWhenBackendError: 3000,

  bot_discord_user_id: '890398508526489670',
  teazyou_discord_user_id: '338391027532431370',

  protected_message_ids: [
    '899558709057957889', // bienvenue image maid
    '899558715060027442', // bienvenue text verification
  ],

  verify_valid_until: 60 * 10,

  roles: [
    ['Membres', '899121536861097984'],
  ],

  chatbot: {
    sleepAfterConnect: 1000,
    bearer: `Bearer ${require('../../knex/seeds').users[0].jwtoken}`,

    username: 'teazwar',

    endpoint: '/discord',

    socketRetry: 20,
    socketRetryDelay: 3000, // ms

    pollingEvery: 1000,
    channels: [
      ['server', '898775699312242728'],
      ['game', '890397933663567932'],
      ['stream', '893054188358074378'],
      ['stats', '898797507566534716'],
      ['spam', '899120424632340512'],
      ['bienvenue', '899154241292214313'],
      ['debug', '899731724219596821'],
    ],

  },
}
