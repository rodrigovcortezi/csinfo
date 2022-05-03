const Router = require('koa-router')
const services = require('../services/match')

const router = new Router()

const parseFilters = (ctx) => {
  const filters = {}
  const { teams } = ctx.query
  if (teams) {
    const idList = teams.split(',').map((id) => parseInt(id, 10))
    Object.assign(filters, {
      OR: [
        { team1: { hltvId: { in: idList } } },
        { team2: { hltvId: { in: idList } } },
      ],
    })
  }

  return filters
}

router.get('/match', async (ctx) => {
  const matches = await services.findAll()
  ctx.body = matches
})

router.get('/match/today', async (ctx) => {
  const filters = parseFilters(ctx)
  const matches = await services.findAllToday(filters)
  ctx.body = matches
})

router.get('/match/:id', async (ctx) => {
  const id = parseInt(ctx.params.id, 10)
  const match = await services.find(id)
  ctx.body = match
})

router.post('/match', async (ctx) => {
  const matchesData = ctx.request.body
  const matches = await services.createOrUpdate(matchesData)
  await services.notifyUpdate()
  ctx.response.status = 200
  ctx.body = { count: matches.length, status: 'created' }
})

module.exports = router
