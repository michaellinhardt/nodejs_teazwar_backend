const publicIp = require('public-ip')
module.exports = async () => {
  await (async () => {
    const v6 = await publicIp.v6()
    console.info(v6)
    const v4 = await publicIp.v4()
    console.info(v4)
  })()
}

