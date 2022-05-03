const DEBUG = true
const Bull = require('bull')
const jobs = require('./jobs')

const redis = { host: 'redis' }
const queue = new Bull('matches-retrieval', { redis })

queue.process(async () => {
  return await jobs.retrieveMatches()
})

queue.on('completed', (job, result) => {
  if (DEBUG) {
    console.log(`${result.count} matches updated!`)
  }
})

queue.on('failed', (job, err) => {
  console.log(err.toString())
})

queue.on('error', (error) => {
  console.log(error.toString())
})

const clearQueue = async () => {
  const jobsInQueue = await queue.getRepeatableJobs()
  for (const job of jobsInQueue) {
    await queue.removeRepeatableByKey(job.key)
  }
}

const main = async () => {
  console.log('retriever started...')
  await clearQueue()
  // enqueue job every 5 minutes
  const interval = 5 * 60 * 1000
  const job = await queue.add(null, {
    repeat: { every: interval },
  })
}

main()
