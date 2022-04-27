const Bull = require('bull')
const fetch = require('node-fetch')
const config = require('./config')
const { summaryPublisher } = require('./publisher')

const init = () => {
  const redis = { host: 'redis' }
  const queue = new Bull('match-queue', { redis })

  queue.on('failed', (job, err) => {
    console.log(err.toString())
  })
  queue.on('error', (error) => {
    console.log(error.toString())
  })

  queue.process(async () => {
    const response = await fetch('http://api:3000/match/today')
    const matches = await response.json()
    summaryPublisher(matches)
  })

  const { cron, timeZone: tz } = config
  queue.add(null, { repeat: { cron, tz } })
}

init()
