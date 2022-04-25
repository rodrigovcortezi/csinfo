const fetch = require('node-fetch')
const scraper = require('../scraper')

async function job() {
  const matches = await scraper.getUpcomingMatches()
  console.log(`scraped ${matches.length} matches`)

  const url = 'http://api:3000/match'
  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify(matches),
    headers: { 'Content-Type': 'application/json' },
  })
  const savedMatches = await response.json()
  console.log(`saved ${savedMatches.count} matches`)

  return savedMatches
}

module.exports = job
