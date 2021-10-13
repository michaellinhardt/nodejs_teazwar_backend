const fs = require('fs')

const expire10Years = 60 * 60 * 24 * 365 * 10

module.exports = {
    signOptions: {
        issuer: 'TeazYou',
        audience: 'https://teazyou.com',
        expiresIn: expire10Years,
        algorithm: 'RS512',
    },
    privateKEY: fs.readFileSync(`${__dirname}/../jwtoken/private.jwtoken.key`, 'utf8'),
    publicKEY: fs.readFileSync(`${__dirname}/../jwtoken/public.jwtoken.key`, 'utf8'),
}