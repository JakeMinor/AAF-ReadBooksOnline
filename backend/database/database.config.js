const connectionString = "mongodb://localhost:27017/readBooksOnlineDb"
const mongoose = require("mongoose")

mongoose.Promise = global.Promise

const dbModel = {mongoose: mongoose, url: connectionString, request: require('../database/models/request')(mongoose)}

module.exports = {
 connectToDb() {
  dbModel.mongoose
    .connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
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