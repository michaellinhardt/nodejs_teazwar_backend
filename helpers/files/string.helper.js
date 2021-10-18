const _ = require('lodash')
const uuid = require('uuid').v1

const firstCharUpper = string => {
  const lowered = string.toLowerCase()

  return lowered.charAt(0).toUpperCase() + lowered.slice(1)
}

module.exports = {

  uuid,

  firstCharUpper,

  camelCaseFileName: filename => {
    const nameSplit = filename.split('.')

    const firstName = nameSplit.shift()

    const lastName = nameSplit
      .map(n => firstCharUpper(n))
      .join('')

    return `${firstName}${lastName}`
  },

  randomNumber: length => {
    let result = ''
    const characters = '0123456789'
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  },

  generateOtp: arrayArrays => {
    let otp = ''
    _.forEach(arrayArrays, arrayWords => {
      const word = arrayWords[Math.floor(Math.random() * arrayWords.length)]
      otp = `${otp}${word}`
    })
    return otp.trim().toUpperCase()
  },
}
