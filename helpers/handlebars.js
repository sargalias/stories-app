const moment = require('moment');

module.exports.footerDate = () => {
    return new Date().getFullYear();
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

module.exports.ifEqualsStr = function(str1, str2, options) {
    return str1 === str2 ? options.fn(this) : options.inverse(this);
};