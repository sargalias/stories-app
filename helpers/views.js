const moment = require('moment');

module.exports.removeScriptTags = (input) => {
    return input.replace(/<.*?script.*?>.*?<\/.*?script.*?>/igm, '');
};

module.exports.trimTags = (body) => {
    return body.replace(/<(.|\n)*?>/g, '');
};

module.exports.trimBody = (body) => {
    let words = body.split(' ');
    if (words.length <= 20) {
        return words.join(' ');
    }
    return words.splice(0, 20).join(' ') + '...';
};

module.exports.formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
};
