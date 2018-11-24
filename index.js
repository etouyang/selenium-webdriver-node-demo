const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const {requestRouter} = require('./router')

const app = new Koa()
const port = 3101
const path = '/api'
const router = new Router()

router.use(path, requestRouter.routes(), requestRouter.allowedMethods())
app.use(bodyParser())
app.listen(port)
app.use(router.routes())
  .use(router.allowedMethods())