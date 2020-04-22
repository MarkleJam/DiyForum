var router = require('koa-router')();
var DB = require('../module/db.js');
var JSON = require('JSON');
const UserCollection = 'user';
const CommentCollection = 'comment';
const ArticalCollection = 'article';

router.get('/show', async (ctx)=>{
    let id = ctx.query.id;
    let article = await DB.find(ArticalCollection, {'_id':DB.getObjectID(id)});
    
    await ctx.render('articles/detail',{Article:article[0]});
})

router.get('/:id/edit', async (ctx) => {
    let id = ctx.params.id;
    let articles = await DB.find(ArticalCollection, {'_id':DB.getObjectID(id)});
    let article = articles[0];
    await ctx.render('articles/edit',{Article:article});
})

//Do edit
router.post("/:id/doEdit", async (ctx) => {
    let id = ctx.params.id;
    let content = await ctx.request.body;
    
    await DB.update(ArticalCollection, {'_id':DB.getObjectID(id)}, content);
    return ctx.redirect('/article/show?id=' + id);
}) 

router.get('/add', isLoggedIn, async (ctx) => {
    await ctx.render('articles/addArticle');
})

router.post('/doAdd', async (ctx) => {
    
    let content = await ctx.request.body;
    let newAuthor = {id: ctx.req.user._id, username:ctx.req.user.username}
    content.comments = [];
    content.author = newAuthor;
    var ret = await DB.insert(ArticalCollection, content);

    try {
        if(ret.result.ok) {
            ctx.redirect('/');
        } 
    } catch(err) {
        console.log(err);
        ctx.redirect('/articles/add');
        return;
    }
})

router.get('/:id/doDelete',async (ctx) => {
    let id = ctx.params.id;
    let articles = await DB.find(ArticalCollection, {'_id':DB.getObjectID(id)});
    let article = articles[0];

    article.comments.map(async (comment)=>{
        console.log("I am deleting:" + comment._id);        
        await DB.delete(CommentCollection, {'_id':DB.getObjectID(comment._id)})
    })

    var result = await DB.delete(ArticalCollection, {'_id':DB.getObjectID(id)});    
    
    try {
        if(result.result.ok) {
            ctx.redirect('/');
        }
    } catch (err) {
        ctx.body = err;
        return 
    }   
})

function isLoggedIn(ctx, next){
    if(ctx.isAuthenticated()){
        return next();
    }
    ctx.redirect("/user/login");
}

module.exports = router.routes()