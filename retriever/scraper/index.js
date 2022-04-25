const cheerio = require('cheerio')
const fetch = require('node-fetch')
const config = require('./config')
const toInt = require('./utils').toInt

const fetchPage = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': config.userAgent,
    },
  })
  const page = await response.text()
  return page
}

const getMatch = async (url) => {
  const page = await fetchPage(url)
  const $ = cheerio.load(page)

  const getTeam = (num) => {
    const nodes = $('.teamsBox > div[class*="team"]')
    const node = nodes[num - 1]
    const hltvPathNode = $('a', node)
    if ($(hltvPathNode).length === 0) return null
    const hltvPath = $(hltvPathNode).attr('href')
    const hltvInfo = hltvPath.split('/')
    const hltvSlug = hltvInfo.pop()
    const hltvId = toInt(hltvInfo.pop())
    const name = $('.teamName', hltvPathNode).text()
    const logoUrl = $('.logo', hltvPathNode).attr('src')
    return {
      hltvId,
      hltvSlug,
      name,
      logoUrl,
    }
  }

  const getEvent = () => {
    const node = $('.matchSidebarEvent')
    const hltvPath = $('a', node).attr('href')
    const hltvInfo = hltvPath.split('/')
    const hltvSlug = hltvInfo.pop()
    const hltvId = toInt(hltvInfo.pop())
    const name = $('.matchSidebarEventName', node).text()
    const logoUrl = $('.matchSidebarEventLogo', node).attr('src')
    return {
      hltvId,
      hltvSlug,
      name,
      logoUrl,
    }
  }

  const event = getEvent()
  const team1 = getTeam(1)
  const team2 = getTeam(2)
  const hltvInfo = url.split('/')
  const hltvSlug = hltvInfo.pop()
  const hltvId = toInt(hltvInfo.pop())
  const unixDate = toInt($('.teamsBox .date').attr('data-unix'))
  const date = new Date(unixDate)
  const meta = $('.maps .veto-box > div').text().split(/\r?\n/)[0]

  return {
    hltvId,
    hltvSlug,
    event,
    team1,
    team2,
    date,
    meta,
  }
}

const getUpcomingMatches = async () => {
  const url = `${config.url.base}/${config.url.matches}`
  const page = await fetchPage(url)
  const $ = cheerio.load(page)

  const matchUrls = $('.upcomingMatch a.match')
    .map((_, el) => config.url.base + $(el).attr('href'))
    .toArray()

  const promises = []
  for (const url of matchUrls) {
    promises.push(getMatch(url))
  }

  const matches = await Promise.all(promises)

  return matches
}

module.exports = {
  getUpcomingMatches,
}
