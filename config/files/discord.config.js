module.exports = {
    token: 'ODkwMzk4NTA4NTI2NDg5Njcw.YUvOOw.6fwHa3FYSqoReOwBDpHZxN9Me3g',
    clientId: '890398508526489670',
    guildId: '879871370383724576',

    chatbot: {
        sleepAfterConnect: 1000,
        bearer: `Bearer ${require('../../knex/seeds').users[0].jwtoken}`,

        endpoint: '/discord',

        socketRetry: 20,
        socketRetryDelay: 3000, // ms
  
        pollingEvery: 1000,
        channels: [
          [ 'server', '898775699312242728' ],
          [ 'game', '890397933663567932' ],
          [ 'stream', '893054188358074378' ],
          [ 'stats', '898797507566534716' ],
        ],
      
    },
}