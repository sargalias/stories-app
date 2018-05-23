const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    authorId: {type: String, required: true},
    body: {type: String, required: true},
    date: {type: Date, default: Date.now, required: true}
});

module.exports = commentSchema;