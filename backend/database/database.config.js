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
const config = require('../database/models/config')(mongoose)
const notification = require('../database/models/notifications')(mongoose)

mongoose.Promise = global.Promise

const dbModel = {mongoose: mongoose, url: connectionString, permission: permission, role: role,  request: request, status: status, user: user, config: config, notification: notification }

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
   // Data to be inserted into the database.
   //Permissions
   const permissions = [{_id: "123456789101", name: "ReadRequest"}, {_id: "123456789102",name: "CreateRequest"}, {_id: "123456789103",name: "DeleteRequest"}, {_id: "123456789104",name: "UpdateRequest"}, {_id: "123456789105",name: 'CompleteRequest'}]
   
   //Roles
   const roles = [{_id: "123456789106", name: 'Client'}, {_id: "123456789107", name: 'Employee'}, {_id: "123456789108", name: 'Authoriser'}]
   
   // Users
   const users = [{_id: "123456789109", username: "SEEDED USER", email: "SEEDED EMAIL", password: await bcrypt.hash("SEEDED PASSWORD", 10), roles: [roles[0]._id]},
                  {_id: "123456789110", username: "SEEDED EMPLOYEE", email: "SEEDED EMPLOYEE EMAIL", password: await bcrypt.hash("SEEDED PASSWORD", 10), roles: [roles[1]._id]},
                  {_id: "123456789111", username: "SEEDED AUTHORISER", email: "SEEDED AUTHORISER EMAIL", password: await bcrypt.hash("SEEDED PASSWORD", 10), roles: [roles[2]._id]}]
   
   //Requests
   const requests = [{_id: "123456789112", bookName: "SEEDED BOOK", bookType: "Book", author: "SEEDED AUTHOR", requestedDateTime: new Date().toUTCString(), requestedBy: users[0]._id}, 
                     {_id: "123456789113", bookName: "SEEDED BOOK 2", bookType: "Audiobook", author: "SEEDED AUTHOR 2", isbn: "SEEDEDISBN", requestedDateTime: 'Mon, 31 Jan 2022 18:38:00 GMT', requestedBy: users[0]._id, assignedTo: users[1]._id, status: "In Review"}]

   //Status History
   const statusHistory = [{requestId: requests[1]._id, status: "Pending Review", updatedBy: users[0]._id, date: new Date().toUTCString()},
                          {requestId: requests[1]._id, status: "In Review", updatedBy: users[1]._id, date: new Date().toUTCString()}]
   
   //Config
   const config = {spendThreshold: 10, monthlySpendThreshold: 110, totalMonthlySpend: 0}
   
   
   // Insert data into the test Database.
   await dbModel.mongoose.model("permission").insertMany(permissions) //Permissions
   await dbModel.mongoose.model("role").insertMany(roles) //Roles
   await dbModel.mongoose.model("user").insertMany(users) //Users
   await dbModel.mongoose.model("request").insertMany(requests) //Requests
   await dbModel.mongoose.model("status").insertMany(statusHistory) //StatusHistory
   await dbModel.mongoose.model("config").create(config) //Config
   
   // Return an object of ID's to use in the tests.
   return { userId: users[0]._id, employeeId: users[1]._id, authoriserId: users[2]._id}
  }
 },
 getModel: (modelName) => {
  return dbModel.mongoose.model(modelName)
 },
}

