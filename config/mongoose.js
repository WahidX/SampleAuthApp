const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECT);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting mongodb'));

db.once('open', function(){
    console.log("Connected to mongoDB");
});

module.exports = db;