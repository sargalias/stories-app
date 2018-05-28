
function getGoogleAvatarUrl(googleProfile) {
    return googleProfile._json.image.url.replace(/\?sz=.+/, '');
}

module.exports = getGoogleAvatarUrl;