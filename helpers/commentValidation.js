const {checkSchema} = require('express-validator/check');

module.exports.commentValidation = checkSchema({
    commentText: {
        in: ['body'],
        trim: true,
        errorMessage: 'Comment is required',
        isLength: {
            options: {min: 1}
        },
        escape: true
    },
});
