var Koa = require('koa');
var Router = require('koa-router');
var app = new Koa();
var router = new Router();
var views = require('koa-views');
var bodyParser = require('koa-bodyparser');
var DB = require('./module/db.js');

const ArticalCollection = 'article';
const UserCollection = 'article';

app.use(bodyParser());
app.use(views('views', {
    extension:'ejs'
}))

router.get('/', async (ctx) => {
    var articles  = await DB.find(ArticalCollection);
    await ctx.render('home',{
        Articles : articles
    });
})

router.get('/article/add', async (ctx) => {
    await ctx.render('new');
})

router.post('/article/doAdd', async (ctx) => {
    console.log('I am trying to post a new article');
    let content = await ctx.request.body;
    console.log("dang!!!!"+content);
    var ret = await DB.insert(ArticalCollection, content);

    try {
        if(ret.result.ok) {
            ctx.redirect('/');
        } else {
    
        }
    } catch(err) {
        console.log(err);
        ctx.redirect('/article/add');
        return;
    }
})

app.use(router.routes());

app.listen(3000);