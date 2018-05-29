const mongoose = require('mongoose');
const Comment = require('./Comment');
const Story = require('./Story');

const userSchema = new mongoose.Schema({
    googleId: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    stories: [Story.schema],
    image: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
