// const h = require('./helpers')
// const _ = require('lodash')
// const { render } = require('prettyjson')

let callbackTimeout

let timeoutRegister

const execTimeout = async () => {
  if (!callbackTimeout) { return false }
  await callbackTimeout()
  callbackTimeout = null
}

const addTimeout = (method, ms) => {
  // callbackTimeout = method
  // setTimeout(execTimeout, ms)
  if (timeoutRegister) { clearTimeout(timeoutRegister) }
  timeoutRegister = setTimeout(method, ms)
}

const start = () => {

  addTimeout(() => console.debug(1), 1000)
  addTimeout(() => console.debug(2), 1000)
  addTimeout(() => console.debug(3), 1000)

  // process.exit(0)
}

start()

