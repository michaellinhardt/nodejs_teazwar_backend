import * as Promise from 'bluebird'
const Discord = require('discord.js')
const _ = require('lodash')
const { io } = require('socket.io-client')

const { language, discord: { token, chatbot }, backend } = require('../config')
const h = require('../helpers')

let socket = null
const socketUrl = `${backend.uri}:${backend.socketPort}`
const lang = language.default

const start = async () => {
    // const intents = [Discord.Intents.FLAGS.GUILDS]
    // const discord = new Discord.Client({ intents });

    // await connect(discord)
    // await build_say(discord)
    // await h.code.sleep(3000)

    // await discord.say('debug_welcome')
    // await discord.say('game_welcome')
    // await discord.say('stream_welcome')

    openSocket()
}

const testSocket = () => {
    console.debug('emiit!', socket.id)
    socket.emit('iam', {
        name: 'discord',
    })
}

const openSocket = () => {
    socket = io(socketUrl)
    socket.on("connect", () => { 
        console.log('connected: ', socket.id)

        socket.onAny((eventName, ...args) => {
            console.debug(`Received from: ${socket.id} [${eventName}]\n`, args[0])
        });
    
        setTimeout(testSocket, 1000)
    });
    socket.on("disconnect", () => {  console.log('disconnected: ', socket.id) });
    socket.on("connect_error", () => { console.debug('connect error') });
  }

const connect = async discord => {
    await h.code.sleep(100)
    await discord.login(token)
    await h.code.sleep(chatbot.sleepAfterConnect)
}

const build_say = async discord => {
    await Promise.each(chatbot.channels, async channelArr => {
        const [ name, id ] = channelArr
        const channel = await discord.channels.cache.get(id)
        discord[`_${name}`] = channel
        discord[`_${name}`].say = (msg) => channel.send(msg)
    }, { concurrency: 3 })

    discord.say = (message_key, ...args) => {
        const channel = (message_key.split('_'))[0]
        const message = h.language.get(lang, 'discord', message_key, ...args)
        discord[`_${channel}`].say(message)
    }
}

start()