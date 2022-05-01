const Bull = require('bull')
const fetch = require('node-fetch')
const config = require('./config')
const TwitterPublisher = require('./publisher')

const setupBot = () => {
  const redis = { host: 'redis' }
  const queue = new Bull('match-queue', { redis })

  queue.on('failed', (_, err) => {
    console.error('ERROR: job failed')
    console.error(err.toString())
  })

  queue.on('error', (error) => {
    console.error('ERROR: job error')
    console.error(error.toString())
  })

  const publishers = []

  queue.process(async () => {
    const response = await fetch('http://api:3000/match/today')
    const matches = await response.json()
    publishers.forEach((publisherCallback) => {
      publisherCallback(matches)
    })
  })

  return {
    init() {
      const { cron, timeZone: tz } = config
      queue.add(null, {
        repeat: { cron, tz },
        removeOnComplete: 10,
        removeOnFailed: 10,
      })
    },
    add(callback) {
      publishers.push(callback)
    },
  }
}

const bot = setupBot()
Object.values(TwitterPublisher).forEach((callback) => {
  bot.add(callback)
})
bot.init()
