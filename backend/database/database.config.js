let connectionString = "mongodb://localhost:27017/readBooksOnlineDb"
const mongoose = require("mongoose")
const { MongoMemoryServer } = require('mongodb-memory-server')
let testDb = null
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
 async connectToDb() {
  if(process.env.NODE_ENV === "test"){
   testDb = await MongoMemoryServer.create()
   connectionString = testDb.getUri()
  }
  dbModel.mongoose
    .connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
     if(process.env.NODE_ENV === "test"){console.log("Connected to test DB")}
     else {console.log("Connected to dev DB")}
    })
    .catch(error => {
     console.log(`An error has occurred ${error}`)
     process.exit()
    })
 },
 async clearTestDb() {
  if (process.env.NODE_ENV === "test") {
   for (collection in mongoose.connection.collections)
   {
    await mongoose.connection.collections[collection].deleteMany()
   }
  }
 },
 getModel: (modelName) => {
  return dbModel.mongoose.model(modelName)
 },
}