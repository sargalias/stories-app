const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {console.log('MongoDB connected')});

module.exports = db;
