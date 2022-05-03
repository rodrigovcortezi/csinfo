const { TwitterApi } = require('twitter-api-v2')
const redis = require('redis')

const moment = require('moment-timezone')
const config = require('../config')
moment.tz.setDefault(config.timeZone)

const twitterClient = () => {
  const client = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
  })
  return client
}

const postContent = (matches) => {
  const headline = 'Partidas 🇧🇷'
  const list = []
  matches.forEach((match) => {
    const { team1, team2, date } = match
    const t1 = team1.name
    const t2 = team2.name
    const time = moment(date).format('H:mm')
    const format = `\n• ${t1} vs. ${t2} às ${time}`
    list.push(format)
  })

  return headline + list.join('')
}

const postSummary = async (matches) => {
  const client = twitterClient()
  const content = postContent(matches)
  await client.v2.tweet(content)
  console.log('---post---')
  console.log(content)
  console.log('----------')
}

const cacheLastSummary = async (client, matches) => {
  await client.set('post:summary:last', JSON.stringify(matches))
}

const compareMatches = (match1, match2) => {
  return (
    match1.date == match2.date &&
    match1.team1.hltvId == match2.team1.hltvId &&
    match1.team2.hltvId == match2.team2.hltvId
  )
}

const compare = (list1, list2) => {
  if (list1.length != list2.length) return false
  const zip = (a, b) => a.map((k, i) => [k, b[i]])
  for ([m1, m2] of zip(list1, list2)) {
    if (!compareMatches(m1, m2)) {
      return false
    }
  }

  return true
}

const summaryPublisher = async (allMatches) => {
  const matches = allMatches.filter((match) => {
    return (
      config.targetTeams.includes(match.team1.hltvId) ||
      config.targetTeams.includes(match.team2.hltvId)
    )
  })
  if (matches.length === 0) {
    console.log('no matches found... skipping post!')
    return
  }
  const firstMatch = matches[0]
  const timeToFirstMatch = moment(firstMatch.date).diff(moment(), 'minutes')
  // Maximum time (in minutes) to first match
  const maxTimeToMatch = 150
  if (timeToFirstMatch > maxTimeToMatch) {
    console.log(
      'first match found not happening whithin next 2 hours... skipping post!'
    )
    return
  }
  const redisClient = redis.createClient({ url: 'redis://redis:6379' })
  await redisClient.connect()
  const cache = await redisClient.get('post:summary:last')
  const lastSummary = JSON.parse(cache)
  if (lastSummary && compare(matches, lastSummary)) {
    console.log('post equal to cache... skipping post!')
    return
  }
  await postSummary(matches)
  await cacheLastSummary(redisClient, matches)
  redisClient.quit()
}

module.exports = summaryPublisher
