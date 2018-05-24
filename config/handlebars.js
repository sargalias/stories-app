module.exports = function(app) {
    const hbs = exphbs.create({
        helpers: {
            footerDate: exphbsHelpers.footerDate,
            trimTags: exphbsHelpers.trimTags,
            trimBody: exphbsHelpers.trimBody,
            formatDate: exphbsHelpers.formatDate,
            ifEqualsStr: exphbsHelpers.ifEqualsStr
        },
        defaultLayout: 'main'
    });
    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
};