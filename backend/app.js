const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('cookie-session')
const logger = require('morgan')
const cors = require('cors')
const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({name: 'session', keys: ['']}))
app.use(cors({origin: "http://localhost:8080", credentials: true}))
// Passes app object to router file to assign routes
require("./router/router.config")(app)
// Passes app object to error handler config file
require('./config/error-handler.config')(app)
// Connects the API to the DB
require('./database/database.config').connectToDb().catch(error => {console.log(error)})

module.exports = app
