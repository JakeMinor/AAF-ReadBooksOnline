let connectionString = "mongodb://localhost:27017/readBooksOnlineDb"
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { MongoMemoryServer } = require('mongodb-memory-server')
//Models
const request = require('../database/models/request')(mongoose)
const status = require('../database/models/status')(mongoose)
const user = require('../database/models/user')(mongoose)
const role = require('../database/models/role')(mongoose)
const permission = require('../database/models/permission')(mongoose)

mongoose.Promise = global.Promise

const dbModel = {mongoose: mongoose, url: connectionString, permission: permission, role: role,  request: request, status: status, user: user }

mongoose.plugin(schema => {
 schema.pre('createRequest', enableValidators)
 schema.pre('createUser', enableValidators)
})

function enableValidators() { this.setOptions({ runValidators: true}) }

module.exports = {
 async connectToDb() {
  if(process.env.NODE_ENV === "test"){
   connectionString = (await MongoMemoryServer.create()).getUri()
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
 async seedTestData() {
  if (process.env.NODE_ENV === "test") {
   let user = await dbModel.mongoose.model("user").create({
    "username": "SEEDED USER",
    "email": "SEEDED EMAIL",
    "password": await bcrypt.hash("SEEDED PASSWORD", 10),
    "role": "Client"
   }).catch(error => {
    console.log(error)
   })
   
   dbModel.mongoose.model("request").create({
    "bookName": "SEEDED BOOK",
    "bookType": "Book",
    "author": "SEEDED AUTHOR",
    "requestedDateTime": new Date().toUTCString(),
    "requestedBy": user._id
   }).catch(error => {
    console.log(error)
   })
   return user._id
  }
 },
 getModel: (modelName) => {
  return dbModel.mongoose.model(modelName)
 },
}

