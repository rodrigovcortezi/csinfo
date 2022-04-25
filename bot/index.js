const CronJob = require('cron').CronJob
const { TwitterApi } = require('twitter-api-v2')
const fetch = require('node-fetch')
const moment = require('moment-timezone')
const config = require('./config')
const timeZone = 'America/Sao_Paulo'

const client = new TwitterApi({
  appKey: 'MHodl548faUtuVUAMou7LEor9',
  appSecret: 'vPsl0sj7Etz6x79RXPflk0y1ubZdEaF0vOcypj6jfzh5HPFACn',
  accessToken: '1516426533501640719-CI0y3PPBefJs0VzhKToDNgV9OtQA6s',
  accessSecret: 'eWffU2AQNjI8wcblBVXpBr7GZlMpEVqGWrWUnMBnUODmh',
})

const formatPost = (matches) => {
  const now = moment().tz(timeZone).format('H:mm')
  let post = `🇧🇷 ${now}`
  matches.forEach((m) => {
    const time = moment(m.date).tz(timeZone).format('H:mm')
    post += `\n${m.team1.name} vs ${m.team2.name} às ${time}`
  })

  return post
}

const postMatches = async () => {
  const url = 'http://api:3000/match/today'
  const params = 'teams=' + config.targetTeams.join(',')
  console.log('Fetching matches for post...')
  const response = await fetch(url + '?' + params)
  const matches = await response.json()
  console.log(`${matches.length} matches found`)
  if (matches.length > 0) {
    const tweetContent = formatPost(matches)
    console.log('---post---')
    console.log(tweetContent)
    console.log('----------')
    await client.v2.tweet(tweetContent)
  }
}

const job = new CronJob(config.cron, postMatches, null, false, timeZone)
job.start()
