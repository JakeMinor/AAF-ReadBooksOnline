let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Passes app object to router file to assign routes
require("./router/router.config")(app)
// Passes app object to error handler config file
require('./error-handler.config')(app)
// Connects the API to the DB
require('./database/database.config').connectToDb()

module.exports = app;
