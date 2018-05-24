if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// Initialise database
const db = require('./database');

// Seed database
if (process.env.SEED_DATABASE === 'true') {
    require('./database-seed');
}
