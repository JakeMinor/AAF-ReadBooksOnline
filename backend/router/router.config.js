const requestRoutes = require("./routes/requests")
const express = require("express")
//Set up swagger
const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('../swagger.json')

module.exports = (app) => {
 app.use('/bookRequest', requestRoutes)

 app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocument));
 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}


