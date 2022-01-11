const connectionString = require("../database/config").connectionString
const mongoose = require("mongoose")

mongoose.Promise = global.Promise

const dbModel = {mongoose: mongoose, url: connectionString, book: require('../database/models/books')(mongoose)}

module.exports = {
 connectToDb () {
  dbModel.mongoose
    .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Successful connection"))
    .catch(error => {
      console.log(`An error has occurred ${error}`)
      process.exit()
    })
 },
 getDatabase: () => {
  return dbModel
 }
}