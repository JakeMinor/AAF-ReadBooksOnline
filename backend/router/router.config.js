const requestRoutes = require("./routes/requests")
const userRoutes = require("./routes/users")
const permissionRoutes = require("./routes/permissions")
//Set up swagger
const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('../swagger.json')

module.exports = (app) => {
 app.use('/bookRequest', requestRoutes)
 app.use('/user', userRoutes)
 app.use('/permission', permissionRoutes)
 app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocument));
 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}




