const mongoose = require('mongoose');
const User = require('./User');

const commentSchema = new mongoose.Schema({
    storyId: {type: String, required: true},
    body: {type: String, required: true},
    date: {type: Date, default: Date.now, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Comment', commentSchema);