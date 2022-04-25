const Router = require('koa-router')
const services = require('../services/match')

const router = new Router()

router.get('/match', async (ctx) => {
  const matches = await services.findAll()
  ctx.body = matches
})

router.get('/match/today', async (ctx) => {
  const { teams } = ctx.query
  if (teams) {
    const idList = teams.split(',').map((id) => parseInt(id, 10))
    let filter = {
      OR: [
        { team1: { hltvId: { in: idList } } },
        { team2: { hltvId: { in: idList } } },
      ],
    }
    const matches = await services.findAllToday(filter)
    ctx.body = matches
  } else {
    const matches = await services.findAllToday()
    ctx.body = matches
  }
})

router.post('/match', async (ctx) => {
  const matchesData = ctx.request.body
  const matches = await services.createOrUpdate(matchesData)
  ctx.response.status = 200
  ctx.body = { count: matches.length, status: 'created' }
})

module.exports = router
