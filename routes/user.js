var router = require('koa-router')();
var DB = require('../module/db.js');
var User = require("../models/user");
var passport = require("koa-passport");

const UserCollection = 'user';
const CommentCollection = 'comment';
const ArticalCollection = 'article';

router.get('/register', async (ctx) => {
    await ctx.render('user/register');
})

router.post('/register', async (ctx) => {
    //console.log('I am trying to post a new article');
    const ret = await DB.insert(UserCollection, ctx.request.body);
    return passport.authenticate('local', function(err, user, info, status) {
        user = ctx.request.body;
        if (user === false) {
          ctx.body = { success: false }
          ctx.throw(401)
        } else {
            ctx.redirect('/');
            return ctx.login(user)
        }
      })(ctx);
})

router.get("/login",async function(ctx) {
    await ctx.render("../views/user/login");
})

router.post("/login",passport.authenticate("local",{
   successRedirect: "/",
   failureRedirect: "/user/login"
   }),function(ctx){
});

// logic route
router.get("/logout", function(ctx){
  ctx.logout();
  ctx.redirect("/");
});

module.exports = router.routes()