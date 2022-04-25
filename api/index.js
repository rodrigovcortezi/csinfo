const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./routes')

const app = new Koa()

app.use(bodyParser())
app.use(router.match.routes())

app.listen(3000)
console.log('Application is running on port 3000')
