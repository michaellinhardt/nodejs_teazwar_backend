// const h = require('./helpers')
// const _ = require('lodash')
// const { render } = require('prettyjson')

class testeuh {

  onDelete () { console.debug('no on delete method') }

}

class testeuhh extends testeuh {
  // onDelete () { console.debug('deleted!') }
}

const start = () => {
  const test = new testeuhh()
  test.onDelete()
  process.exit(0)
}

start()

