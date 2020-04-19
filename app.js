var Koa = require('koa');
var Router = require('koa-router');
//var Article = require('./models/article.js');
//var comment = require('./models/comment.js');
var app = new Koa();
var router = new Router();
var views = require('koa-views');
var bodyParser = require('koa-bodyparser');
var DB = require('./module/db.js');
var JSON = require('JSON');

const ArticalCollection = 'article';
const UserCollection = 'user';
const CommentCollection = 'comment';

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
    //console.log('id is:' + id);
    //console.log('id in DB:' + DB.getObjectID(id));
    
    let article = await DB.find(ArticalCollection, {'_id':DB.getObjectID(id)});
    console.log('article is:' + JSON.stringify(article));
    //console.log('The aritcle is like:' + article[0]);
    
    await ctx.render('detail',{Article:article[0]});
})

router.get('/article/add', async (ctx) => {
    await ctx.render('addArticle');
})

router.post('/article/doAdd', async (ctx) => {
    //console.log('I am trying to post a new article');
    let content = await ctx.request.body;
    content.comments = []
    //console.log("dang!!!!"+content);
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

router.get('/article/:id/comment/new', async (ctx) => {
    //console.log(ctx.params.id);
    let article = await DB.find(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)});
    await ctx.render('comments/new',{Article:article[0]});
    //await ctx.render('addArticle');
})

router.post('/article/:id/comment', async (ctx)=>{
    let articles = await DB.find(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)});
    let newComment = ctx.request.body;
    article = articles[0];
    console.log(article);

    //article.comments.push(newComment);
    article.comments.push(newComment);

    DB.insert(CommentCollection, newComment);
    DB.update(ArticalCollection, {'_id':DB.getObjectID(article._id)}, article);

    ctx.redirect('/article/show?id='+article._id);
})

app.use(router.routes());

app.listen(3000);