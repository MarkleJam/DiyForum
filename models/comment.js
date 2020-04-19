var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    CommentAuthor: String,
    CommentCont: String
});

module.exports = mongoose.model('comment', CommentSchema);