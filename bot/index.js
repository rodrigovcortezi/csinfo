const Bull = require('bull')
const fetch = require('node-fetch')
const TwitterPublisher = require('./publisher')

const setupBot = () => {
  const redis = { host: 'redis' }
  const queue = new Bull('matches-updated', { redis })

  queue.on('failed', (_, err) => {
    console.error('ERROR: job failed')
    console.error(err.toString())
  })

  queue.on('error', (error) => {
    console.error('ERROR: job error')
    console.error(error.toString())
  })

  queue.on('completed', () => {
    // Empty queue after processing.
    // This prevents processing stale updates.
    queue.empty()
  })

  const publishers = []

  return {
    init() {
      console.log('bot started...')
      queue.process(async () => {
        const response = await fetch('http://api:3000/match/today')
        const matches = await response.json()
        const promises = []
        publishers.forEach((callback) => {
          const p = callback(matches)
          promises.push(p)
        })

        await Promise.all(promises)
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
