var router = require('koa-router')();
var DB = require('../module/db.js');

const UserCollection = 'user';
const CommentCollection = 'comment';
const ArticalCollection = 'article';


//Below is for adding new comment
router.get('/new',isLoggedIn, async (ctx) => {
    //console.log(ctx.params.id);
    let article = await DB.find(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)});
    await ctx.render('comments/new',{Article:article[0]});
    //await ctx.render('addArticle');
})

router.post('/doAdd', async (ctx)=>{
    let articles = await DB.find(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)});
    
    let newAuthor = {id: ctx.req.user._id, username:ctx.req.user.username}    
    let newComment = ctx.request.body;
    newComment.author = newAuthor;
    
    article = articles[0];
    article.comments.push(newComment);
    console.log('Comments are: ' + JSON.stringify(article.comments));    
    console.log('Type of the comment is:' + (JSON.stringify(article.comments[0])));
    
    DB.insert(CommentCollection, newComment);
    DB.update(ArticalCollection, {'_id':DB.getObjectID(article._id)}, article);

    ctx.redirect('/article/show?id=' + article._id);
})

//Below is for editting comment
router.get('/:commentid/edit', async (ctx) => {
    //console.log(ctx.params.id);
    let articles = await DB.find(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)});
    article = articles[0];
    let comments = await DB.find(CommentCollection, {'_id':DB.getObjectID(ctx.params.commentid)});
    let comment = comments[0];    
    await ctx.render('comments/edit',{Comment: comment, Article: article});
})

router.post('/:commentid/doEdit', async (ctx) => {    
    let newComment = ctx.request.body;
    let author = {id: ctx.req.user._id, username:ctx.req.user.username}    
    newComment.author = author;
    
    let articles = await DB.find(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)});
    let article = articles[0];

    article.comments.filter(comment => comment._id ==  ctx.params.commentid).map(x =>(x.CommentCont = newComment.CommentCont)); 

    await DB.update(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)}, {'comments':article.comments});
    await DB.update(CommentCollection, {'_id':DB.getObjectID(ctx.params.commentid)}, newComment);
    
    return ctx.redirect('/article/show?id=' + ctx.params.id);
})

router.get('/:commentid/doDelete',async (ctx) => {
    let id = ctx.params.commentid;
    var result = await DB.delete(CommentCollection, {'_id':DB.getObjectID(id)});
    
    let articles = await DB.find(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)});
    let article = articles[0];    
    article.comments = article.comments.filter(comment => comment._id !=  ctx.params.commentid)    
    await DB.update(ArticalCollection, {'_id':DB.getObjectID(ctx.params.id)}, {'comments':article.comments});

    try {
        if(result.result.ok) {
            return ctx.redirect('/article/show?id=' + ctx.params.id);
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

module.exports = router.routes();