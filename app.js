var Koa = require('koa');
var Router = require('koa-router');
var app = new Koa();
var router = new Router();
var views = require('koa-views');
var bodyParser = require('koa-bodyparser');
var DB = require('./module/db.js');
var JSON = require('JSON');

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

router.get('/article/show', async (ctx)=>{
    let id = ctx.query.id;
    console.log('id is:' + id);
    console.log('id in DB:' + DB.getObjectID(id));
    
    let article = await DB.find(ArticalCollection, {'_id':DB.getObjectID(id)});
    //console.log('article is:' + JSON.stringify(article));
    await ctx.render('detail',{Article:article[0]});
})

router.get('/article/add', async (ctx) => {
    await ctx.render('addArticle');
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