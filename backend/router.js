const bookRoutes = require("./routes/books")

module.exports = (app) => {
 app.use('/books', bookRoutes)
}