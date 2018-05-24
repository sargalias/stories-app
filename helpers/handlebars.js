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