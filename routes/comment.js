var router = require('koa-router')();
var DB = require('../module/db.js');

const UserCollection = 'user';
const CommentCollection = 'comment';
const ArticalCollection = 'article';

router.get('/new',isLoggedIn, async (ctx) => {
    //console.log(ctx.params.id);
    let article = await DB.find(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)});
    await ctx.render('comments/new',{Article:article[0]});
    //await ctx.render('addArticle');
})

router.post('/', async (ctx)=>{
    let articles = await DB.find(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)});
    let newComment = ctx.request.body;
    
    article = articles[0];
    article.comments.push(newComment);

    DB.insert(CommentCollection, newComment);
    DB.update(ArticalCollection, {'_id':DB.getObjectID(article._id)}, article);

    ctx.redirect('/article/show?id=' + article._id);
})

function isLoggedIn(ctx, next){
    if(ctx.isAuthenticated()){
        return next();
    }
    ctx.redirect("/user/login");
}

module.exports = router.routes();