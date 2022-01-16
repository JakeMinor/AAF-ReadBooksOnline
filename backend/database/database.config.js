const connectionString = "mongodb://localhost:27017/readBooksOnlineDb"
const mongoose = require("mongoose")

//Models
const request = require('../database/models/request')(mongoose)
const user = require('../database/models/user')(mongoose)

mongoose.Promise = global.Promise

const dbModel = {mongoose: mongoose, url: connectionString, request: request, user: user }

mongoose.plugin(schema => {
 schema.pre('createRequest', enableValidators)
})

function enableValidators() { this.setOptions({ runValidators: true}) }

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
 getModel: (modelName) => {
  return dbModel.mongoose.model(modelName)
 }
}