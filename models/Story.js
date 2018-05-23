const mongoose = require('mongoose');
const commentSchema = require('./commentSchema');

const storySchema = new mongoose.Schema({
    title: {type: String, required: true},
    privacy: {type: String, enum: ['PUBLIC', 'PRIVATE', 'UNLISTED'], required: true, default: 'PUBLIC'},
    body: {type: String, required: true},
    published: {type: Date, default: Date.now, required: true},
    allowComments: {type: Boolean, default: true, required: true},
    authorId: {type: String, required: true},
    comments: [commentSchema]
});

module.exports = mongoose.model('Story', storySchema);