const {checkSchema} = require('express-validator/check');
const {removeScriptTags} = require('../helpers/views');

module.exports.storyValidation = checkSchema({
    title: {
        in: ['body'],
        trim: true,
        errorMessage: 'Title is required',
        isLength: {
            options: {min: 1}
        },
        escape: true
    },
    privacy: {
        in: ['body'],
        errorMessage: 'Invalid choice for status',
        exists: true,
        custom: {
            errorMessage: 'Invalid value for Allow Comments',
            options: (val, {req}) => {
                return val.match(/^(PUBLIC|PRIVATE|UNLISTED)$/) != null;
            }
        },
        escape: true
    },
    // if allowComments exists, it must equal true
    allowComments: {
        in: ['body'],
        errorMessage: 'Invalid value for Allow Comments',
        optional: true,
        custom: {
            options: (val, {req}) => {
                return val.match(/^true$/) != null;
            }
        },
        escape: true
    },
    body: {
        in: ['body'],
        errorMessage: 'Body is required',
        trim: true,
        isLength: {
            options: {min: 1}
        },
        custom: {
            options: (val, {req}) => {
                return val.match(/^<p>&nbsp;<\/p>$/) === null;
            }
        },
        customSanitizer: {
            options: (val) => {
                return removeScriptTags(val);
            }
        }
    }
});
