var Koa = require('koa');
var Router = require('koa-router');
var app = new Koa();
var router = new Router();
var views = require('koa-views');

app.use(views('views', {
    extension:'ejs'
}))

router.get('/', async (ctx) => {
    await ctx.render('home');
})

app.use(router.routes());

app.listen(3000);