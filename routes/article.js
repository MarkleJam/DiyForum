var router = require('koa-router')();
var DB = require('../module/db.js');

const UserCollection = 'user';
const CommentCollection = 'comment';
const ArticalCollection = 'article';

router.get('/show', async (ctx)=>{
    let id = ctx.query.id;
    //console.log('id is:' + id);
    //console.log('id in DB:' + DB.getObjectID(id));
    
    let article = await DB.find(ArticalCollection, {'_id':DB.getObjectID(id)});
    
    await ctx.render('detail',{Article:article[0]});
})

router.get('/add', async (ctx) => {
    await ctx.render('addArticle');
})

router.post('/doAdd', async (ctx) => {
    //console.log('I am trying to post a new article');
    let content = await ctx.request.body;
    content.comments = []
    //console.log("dang!!!!"+content);
    var ret = await DB.insert(ArticalCollection, content);

    try {
        if(ret.result.ok) {
            ctx.redirect('/');
        } 
    } catch(err) {
        console.log(err);
        ctx.redirect('/article/add');
        return;
    }
})

module.exports = router.routes()