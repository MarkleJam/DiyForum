var Koa = require('koa');
var Router = require('koa-router');
var app = new Koa();
var router = new Router();

router.get('/', (ctx) => {
    ctx.body = 'Hello!';
})

app.use(router.routes());

app.listen(3000);