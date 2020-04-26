var Koa = require('koa');
var Router = require('koa-router');
var app = new Koa();
var router = new Router();
var views = require('koa-views');
var bodyParser = require('koa-bodyparser');
var DB = require('./module/db.js');
var methodOverride = require('koa-methodoverride');

const ArticalCollection = 'article';
const UserCollection = 'user';
const CommentCollection = 'comment';
var CommentRoute = require('./routes/comment.js');
var UserRoute = require('./routes/user.js');
var ArticleRoute = require('./routes/article.js');
require('./auth.js')

//Below for authentication
var  passport = require("koa-passport");
const session = require('koa-session');

app.use(methodOverride());
app.use(bodyParser());
app.use(views('views', {
    extension:'ejs'
}))

// sessions
app.keys = ['super-secret-key'];
app.use(session(app));

app.use(passport.initialize());
app.use(passport.session());

//Flash Middleware
const flash = require('koa-better-flash');
app.use(flash());

app.use(async function(ctx, next){
    ctx.state.user = ctx.req.user;
    await next();
 });

router.get('/', async (ctx) => {

    var articles  = await DB.find(ArticalCollection);
    await ctx.render('home',{
        Articles : articles
    });
})

router.use('/article', ArticleRoute);
router.use('/article/:id/comment',CommentRoute);
router.use('/user', UserRoute);

app.use(router.routes());
app.listen(process.env.PORT);