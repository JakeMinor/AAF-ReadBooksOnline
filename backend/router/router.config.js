const requestRoutes = require("./routes/requests")

//Set up swagger
const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('../swagger.json')

module.exports = (app) => {
 app.use('/request', requestRoutes)
 
 app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}


