const booksRoutes = require("./routes/books")
module.exports = (app) => {
 app.use('/books', booksRoutes)
}


