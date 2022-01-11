const requestRoutes = require("./routes/requests")
module.exports = (app) => {
 app.use('/request', requestRoutes)
}


