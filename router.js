const Router = require('koa-router')
const {start} =require('./selenium')
const {request} =require('./request')
const requestRouter = new Router()

requestRouter.post('/fetchprice', async(ctx, next) => {
    let opts = ctx.request.body
    // console.log(opts)
    let reg = /[\u4e00-\u9fa5]/g
    let url = opts.url.replace(reg, "")
    try {
        let price = await start(url)
        ctx.body = {
            success: true,
            data: {price}
        }
    } catch {
        ctx.body = {
            success: false
        }
    }
})

requestRouter.post('/fetchcoupons', async(ctx, next) => {
    let opts = ctx.request.body
    // console.log(opts)
    let reg = /[\u4e00-\u9fa5]/g
    let url = opts.url.replace(reg, "")
    let page = opts.page
    try {
        let coupons = await request(url, page)
        ctx.body = {
            success: true,
            data: {coupons}
        }
    } catch {
        ctx.body = {
            success: false
        }
    }
})

requestRouter.get('/test', async(ctx, next) => {
    ctx.body = {
        success: true
    }
})

module.exports = {requestRouter}