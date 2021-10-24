const {
  msOneYear,
} = require('../../helpers/files/date.helper')

const fs = require('fs')

const itvJwtExpireIn10Years = msOneYear * 10

const twitchSecret = 'uyASGPXW5jNMKcG8tscdLyCy1wKsKvuDaZEFiq3My40='

module.exports = {
  // eslint-disable-next-line max-len
  teazwarToken: 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNmM3OWI3MTAtMmQzNy0xMWVjLWJhNmQtYjNjZGIwNGIzMzkwIiwiaWF0IjoxNjM0MjQ3NjYwLCJleHAiOjE5NDk2MDc2NjAsImF1ZCI6Imh0dHBzOi8vdGVhenlvdS5jb20iLCJpc3MiOiJUZWF6WW91Iiwic3ViIjoiMWU4YjZiZjAtMWI1MC0xMWVjLTg1ZWMtNGQwMzNjODBjMDM1In0.KJyjkUiJVNRIk6yi3uWrLqe6l86kQY4D8jd2rE56MMGFj0nTwTclKaSQnePCJqGRU0xWE4j1ZjSYw4hmqFJUPo-qjo9UBSx4FzLj7OIOLff-ffuGXz8OZfEkha3wDh8BhgXfDO4hAVrRcSoryMkf-qFYdNDezztI51yDT9jFoHc',
  signOptions: {
    issuer: 'TeazYou',
    audience: 'https://teazyou.com',
    expiresIn: itvJwtExpireIn10Years,
    algorithm: 'RS512',
  },
  privateKEY: fs.readFileSync(`${__dirname}/../jwtoken/private.jwtoken.key`, 'utf8'),
  publicKEY: fs.readFileSync(`${__dirname}/../jwtoken/public.jwtoken.key`, 'utf8'),
  twitchSecret: Buffer.from(twitchSecret, 'base64'),
}
