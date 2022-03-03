let connectionString = "mongodb://localhost:27017/readBooksOnlineDb"
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { MongoMemoryServer } = require('mongodb-memory-server')

//Models.
const request = require('../database/models/request')(mongoose)
const status = require('../database/models/status')(mongoose)
const user = require('../database/models/user')(mongoose)
const role = require('../database/models/role')(mongoose)
const permission = require('../database/models/permission')(mongoose)
const config = require('../database/models/config')(mongoose)
const notification = require('../database/models/notifications')(mongoose)

mongoose.Promise = global.Promise

// Creates the database Model.
const dbModel = {mongoose: mongoose, url: connectionString, permission: permission, role: role,  request: request, status: status, user: user, config: config, notification: notification }

// Enables validators for before data is saved to the database.
mongoose.plugin(schema => {
 schema.pre('createRequest', enableValidators)
 schema.pre('updateRequest', enableValidators)
 schema.pre('createUser', enableValidators)
 schema.pre('updateUser', enableValidators)
 schema.pre('createRole', enableValidators)
 schema.pre('updateRole', enableValidators)
 schema.pre('createPermission', enableValidators)
 schema.pre('updatePermission', enableValidators)
 schema.pre('createStatus', enableValidators)
 schema.pre('createNotification', enableValidators)
 schema.pre('updateConfig', enableValidators)
})

function enableValidators() { this.setOptions({ runValidators: true}) }

module.exports = {
 // Creates a connection to the database.
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
 // Clears the test database.
 async clearTestDb() {
  if (process.env.NODE_ENV === "test") {
   for (collection in mongoose.connection.collections)
   {
    await mongoose.connection.collections[collection].deleteMany()
   }
  }
 },
 // Seeds the test database.
 async seedTestData() {
  if (process.env.NODE_ENV === "test") {
   // Data to be inserted into the database.
   //Permissions
   const permissions = [{_id: "123456789101", name: "ReadRequest"}, {_id: "123456789102",name: "CreateRequest"}, 
    {_id: "123456789103",name: "DeleteRequest"}, {_id: "123456789104",name: "UpdateRequest"}, 
    {_id: "123456789105",name: 'CompleteRequest'}, {_id: "123456789114", name: 'AllocateRequest'}, 
    {_id: "123456789115", name: 'RequestMoreInformation'}, {_id: "123456789116", name: "AuthoriseRequest"},
    {_id: "123456789117", name: "ReadStatisticReport"}, {_id: "123456789118", name: "CreateUser"},
    {_id: "123456789119", name: "UpdateUser"}, {_id: "123456789120", name: "ReadUser"},
    {_id: "123456789121", name: "DeleteUser"}, {_id: "123456789122", name: "CreateRole"},
    {_id: "123456789123", name: "UpdateRole"}, {_id: "123456789124", name: "ReadRole"},
    {_id: "123456789125", name: "DeleteRole"}, {_id: "123456789126", name: "DeletePermission"},
    {_id: "123456789127", name: "UpdatePermission"}, {_id: "123456789128", name: "CreatePermission"},
    {_id: "123456789129", name: "ReadPermission"}, {_id: "123456789130", name: "GetConfig"},
    {_id: "123456789131", name: "UpdateConfig"}]
   
   const clientPermissions = ["123456789101", "123456789102", "123456789103", "123456789104"]
   const employeePermissions = ["123456789101", "123456789104", "123456789105", "123456789114", "123456789115"]
   const authoriserPermissions = ["123456789101", "123456789104", "123456789116", "123456789117"]
   const userManagerPermissions = ["123456789118", "123456789119", "123456789120", "123456789121", "123456789122", "123456789123", "123456789124", "123456789125", "123456789126", "123456789127", "123456789128", "123456789129", "123456789130", "123456789131"]
   
   //Roles
   const roles = [{_id: "123456789106", name: 'Client', permissions: clientPermissions}, {_id: "123456789118", name: "Employee", permissions: employeePermissions}, {_id: "123456789119", name: "Authoriser", permissions: authoriserPermissions}, {_id: "123456789133", name: "UserManager", permissions: userManagerPermissions}]
     
   // Users
   const users = [{_id: "123456789109", username: "SEEDED USER", email: "SEEDED EMAIL", password: await bcrypt.hash("SEEDED PASSWORD", 10), roles: [roles[0]._id]},
                  {_id: "123456789110", username: "SEEDED EMPLOYEE", email: "SEEDED EMPLOYEE EMAIL", password: await bcrypt.hash("SEEDED PASSWORD", 10), roles: [roles[1]._id]},
                  {_id: "123456789111", username: "SEEDED AUTHORISER", email: "SEEDED AUTHORISER EMAIL", password: await bcrypt.hash("SEEDED PASSWORD", 10), roles: [roles[2]._id]},
                  {_id: "123456789132", username: "SEEDED USER MANAGER", email: "SEEDED USER MANAGER EMAIL", password: await bcrypt.hash("SEEDED PASSWORD", 10), roles: [roles[3]._id]}]

   //Requests
   const requests = [{_id: "123456789112", bookName: "SEEDED BOOK", bookType: "Book", author: "SEEDED AUTHOR", requestedDateTime: new Date().toUTCString(), requestedBy: users[0]._id}, 
                     {_id: "123456789113", bookName: "SEEDED BOOK 2", bookType: "Audiobook", author: "SEEDED AUTHOR 2", isbn: "SEEDEDISBN", requestedDateTime: 'Mon, 31 Jan 2022 18:38:00 GMT', requestedBy: users[0]._id, assignedTo: users[1]._id, status: "In Review"},
                     {_id: "123456789136", bookName: "SEEDED BOOK 2", bookType: "Audiobook", author: "SEEDED AUTHOR 2", isbn: "SEEDEDISBN", requestedDateTime: 'Mon, 31 Jan 2022 18:38:00 GMT', requestedBy: users[0]._id, assignedTo: users[1]._id, status: "In Review"}]

   //Status History
   const statusHistory = [{requestId: requests[1]._id, status: "Pending Review", updatedBy: users[0]._id, date: new Date().toUTCString()},
                          {requestId: requests[1]._id, status: "In Review", updatedBy: users[1]._id, date: new Date().toUTCString()},
                          {requestId: requests[2]._id, status: "Pending Review", updatedBy: users[1]._id, date: new Date().toUTCString()},
                          {requestId: requests[2]._id, status: "In Review", updatedBy: users[1]._id, date: new Date().toUTCString()},
                          {requestId: requests[2]._id, status: "Awaiting Approval", updatedBy: users[1]._id, date: new Date().toUTCString()}]
   
   const notifications = [{_id: "123456789134", message: "TEST NOTIFICATION", userId: users[0]._id}]
   
   //Config
   const config = {_id: "123456789135", spendThreshold: 10, monthlySpendThreshold: 110, totalMonthlySpend: 0}
   
   
   // Insert data into the test Database.
   await dbModel.mongoose.model("permission").insertMany(permissions) //Permissions
   await dbModel.mongoose.model("role").insertMany(roles) //Roles
   await dbModel.mongoose.model("user").insertMany(users) //Users
   await dbModel.mongoose.model("notification").create(notifications) //Notifications
   await dbModel.mongoose.model("request").insertMany(requests) //Requests
   await dbModel.mongoose.model("status").insertMany(statusHistory) //StatusHistory
   await dbModel.mongoose.model("config").create(config) //Config
  }
 },
 // Gets the model based on the model name which is passed in.
 getModel: (modelName) => {
  return dbModel.mongoose.model(modelName)
 },
}

