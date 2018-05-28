const mongoose = require('mongoose');
const Comment = require('./Comment');
const Story = require('./Story');

const userSchema = new mongoose.Schema({
    googleId: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    comments: [Comment.schema],
    stories: [Story.schema],
});

module.exports = mongoose.model('User', userSchema);
