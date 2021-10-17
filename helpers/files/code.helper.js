const { render } = require('prettyjson')

module.exports = {

  getAllMethods: (instance) => {
    const props = []
    let obj = instance
    do {
      props.push(...Object.getOwnPropertyNames(obj))
    // eslint-disable-next-line no-cond-assign
    } while (obj = Object.getPrototypeOf(obj))

    // eslint-disable-next-line array-callback-return
    return props.sort().filter((e, i, arr) => {
      if (e !== arr[i + 1] && typeof instance[e] === 'function') { return true }
    })
  },

  dump: objectVar => process.stdout.write(render(objectVar)),

  isObject: objectVar =>
    typeof objectVar === 'object'
    && !Array.isArray(objectVar)
    && objectVar !== null
    && !(objectVar instanceof Date),

  isObjectOrArray: objectVar =>
    (typeof objectVar === 'object'
    && objectVar !== null
    && !(objectVar instanceof Date)),

  sleep: ms => new Promise(resolve => { setTimeout(resolve, ms) }),

}

