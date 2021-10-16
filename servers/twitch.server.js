const tmi = require('tmi.js')
const { io } = require('socket.io-client')

const { language, twitch: { chatbot }, backend, jwt: { teazwarToken } } = require('../config')
const h = require('../helpers')

let socket = null
const socketUrl = `${backend.uri}:${backend.socketPort}`
const lang = language.default
const channel = chatbot.channel
const tmiOpts = chatbot.tmiOpts
tmiOpts.channels = [channel]

const start = async () => {
  // const twitch = new tmi.client(tmiOpts)
  // twitch.backend = () => true

  // build_say(twitch)
  // listen_events(twitch)
  // await connect(twitch)

  openSocket()

}

const emit = {
  post: (path, data = {}) => socket.emit({
      ...data,
      jwtoken: teazwarToken,
      method: 'post',
      path,
  })
}

const logginSocket = () => {
  emit.post('/socket/infra/connected', { infra_name: 'twitch' })
}

const openSocket = () => {
  socket = io(socketUrl)
  socket.on("connect", () => { 
    console.log('connected: ', socket.id)

    socket.onAny((eventName, ...args) => {
      console.debug(`Received from: ${socket.id} [${eventName}]\n`, args[0])
    });

    setTimeout(logginSocket, 100)
  });
  socket.on("disconnect", () => {  console.log('disconnected: ', socket.id) });
  socket.on("connect_error", () => { console.debug('connect error') });
}

const connect = async twitch => {
  await h.code.sleep(100)
  await twitch.connect()
  await h.code.sleep(chatbot.sleepAfterConnect)
}

const build_say = twitch => {
  twitch._say = (message_key, ...args) => {
    const message = h.language.get(lang, 'twitch', message_key, ...args)
    return twitch.say(channel, message)
  }
}

const listen_events = twitch => {
  twitch.on('chat', (channel, userstate, msg, self) =>
    twitch.backend('/twitch/chat', { channel, userstate, msg, self }))
  twitch.on('connected', (address, port) =>
    twitch.backend('/twitch/connected', { address, port }))
  twitch.on('join', (channel, username, self) =>
    twitch.backend('/twitch/join', { channel, username, self }))
  twitch.on('part', (channel, username, self) =>
    twitch.backend('/twitch/part', { channel, username, self }))
}

start()