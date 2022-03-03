const requestRoutes = require("./routes/requests")
const userRoutes = require("./routes/users")
const adminRoutes = require("./routes/admin")
const notificationsRoutes = require("./routes/notifications")

// Swagger UI
const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('../swagger.json')

module.exports = (app) => {
 app.use('/bookRequest', requestRoutes)
 app.use('/user', userRoutes)
 app.use('/admin', adminRoutes)
 app.use('/notification', notificationsRoutes)
 
 // Serves swagger.json file and api docs.
 app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerDocument));
 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}




