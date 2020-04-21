const LocalStrategy = require('passport-local').Strategy;
const UserCollection = 'user';
var  passport = require("koa-passport");
var DB = require('./module/db.js');

passport.use(new LocalStrategy((username, password, done) => {
    console.log("In the strategy, username is: " + username + " password is:" + password);
    
    DB.find(UserCollection, {'username':username})
    .then((users) => {
        //console.log("Users are:" + JSON.stringify(users));
        let user = users[0]
        //console.log('In the strategy, we find user:' + user);
        if (!user) return done(null, false);
        if (password === user.password) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
    .catch((err) => { return done(err); });
}));

// auth
passport.serializeUser((user, done) => { 
    console.log('In the serializer, user is:' + JSON.stringify(user));
    done(null, user._id); 
});

passport.deserializeUser(async (id, done) => {
    console.log('in the deserialize'); 
    try {
        var users = await DB.find(UserCollection,{'_id':DB.getObjectID(id)});
        user = users[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});