module.exports.removeScriptTags = (input) => {
    return input.replace(/<.*?script.*?>.*?<\/.*?script.*?>/igm, '');
};