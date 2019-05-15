const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const session = require('koa-session')
const Redis = require('ioredis')
const RedisSessionStore = require('./server/session-store')
const myConfig = require('./config')
const auth = require('./server/auth')
console.log('-----myConfig')
console.log(myConfig)
const redis = new Redis({
  host: myConfig.myRedis.host,
  port: myConfig.myRedis.port,
  password: myConfig.myRedis.pass
})
app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.keys = ['Jokcy develop Github App']
  const SESSION_CONFIG = {
    key: 'jid',
    store: new RedisSessionStore(redis),
    maxAge: 600 *1000
  }

  server.use(session(SESSION_CONFIG, server))
  auth(server)
  // 配置处理github OAuth的登录

  router.get('/api/user/info', async ctx => {
    const user = ctx.session.userInfo
    if (!user) {
      ctx.status = 401
      ctx.body = 'Need Login'
    } else {
      ctx.body = user
      ctx.set('Content-Type', 'application/json')
    }
  })

  server.use(router.routes())

  server.use(async (ctx, next) => {
    // ctx.cookies.set('id', 'userid:xxxxx')
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.listen(3000, () => {
    console.log('koa server listening on localhost:3000')
  })

  // ctx.body
})
