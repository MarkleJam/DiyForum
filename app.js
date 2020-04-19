var Koa = require('koa');
var Router = require('koa-router');
var app = new Koa();
var router = new Router();
var views = require('koa-views');
var bodyParser = require('koa-bodyparser');
var DB = require('./module/db.js');
var JSON = require('JSON');

const ArticalCollection = 'article';
const UserCollection = 'user';
const CommentCollection = 'comment';

var CommentRoute = require('./routes/comment.js');
var UserRoute = require('./routes/user.js');
var ArticleRoute = require('./routes/article.js');

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

router.use('/article', ArticleRoute);
router.use('/article/:id/comment',CommentRoute);

app.use(router.routes());

app.listen(3000);