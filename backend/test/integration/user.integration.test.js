const chai = require('chai')
const server = require('../../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/user'
const dbConfig = require("../../database/database.config")
const jwt = require("jsonwebtoken")
const accessSecret = require("../../config/authentication.config").AccessSecret
chai.use(require('chai-http'))

let userId = ""
let userManagerId = ""

let userManagerAuthToken = ""
let clientAuthToken = ""
let noPermissionsAuthToken = ""

describe("User", function () {
 /**
  * Tests for the GetAllUsers Controller.
  */
 context("Get All Users",  () => {
  it('GetAllUsers should return 200 and all users', async function () {
   //ARRANGE
   //ACT
   const getAllUsersResult = await chai.request(server).get(baseUrl).set("Cookie", userManagerAuthToken)

   //ASSERT
   getAllUsersResult.should.have.status(200)
   getAllUsersResult.body.users.should.have.lengthOf(4)
  })

  it('GetAllUsers should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   //ACT
   const getAllUsersResult = await chai.request(server).get(`${baseUrl}`)

   //ASSERT
   getAllUsersResult.should.have.status(401)
   getAllUsersResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('GetAllUsers should return 403 if user isnt an Authoriser', async function () {
   //ARRANGE
   //ACT
   const getAllUsersResult = await chai.request(server).get(`${baseUrl}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllUsersResult.should.have.status(403)
   getAllUsersResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })
 })


 /**
  * Tests for the GetNotifications Controller.
  */
 context("Get Notifications", () => {
  it('GetNotifications should return a notifications related to a user and a 200 status', async function () {
   //ARRANGE
   //ACT
   const getNotificationsResult = await chai.request(server).get(`${baseUrl}/${userId}/notifications`).set("Cookie", userManagerAuthToken)
   //ASSERT
   getNotificationsResult.should.have.status(200)
   getNotificationsResult.body.should.have.lengthOf(1)
   getNotificationsResult.body[0].should.have.property("message", "TEST NOTIFICATION")
  })

  it('GetNotifications should return 400 if the ID passed in isnt valid', async function () {
   //ARRANGE
   const invalidId = "INVALIDID"

   //ACT
   const getNotificationsResult = await chai.request(server).get(`${baseUrl}/${invalidId}/notifications`).set("Cookie", userManagerAuthToken)

   //ASSERT
   getNotificationsResult.should.have.status(400)
   getNotificationsResult.text.should.be.equal("ID is not valid.")
  })

  it('GetNotifications should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   //ACT
   const getNotificationsResult = await chai.request(server).get(`${baseUrl}/${userId}/notifications`)

   //ASSERT
   getNotificationsResult.should.have.status(401)
   getNotificationsResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('GetNotifications should return 404 if the ID passed in doesnt exist in the database', async function () {
   //ARRANGE
   const invalidId = "61e59bba7c2128f042a44eea"

   //ACT
   const getNotificationsResult = await chai.request(server).get(`${baseUrl}/${invalidId}/notifications`).set("Cookie", userManagerAuthToken)

   //ASSERT
   getNotificationsResult.should.have.status(404)
   getNotificationsResult.text.should.be.equal("User does not exist in the database.")
  })
 })
 
 /**
  * Tests for the CreateUser Controller.
  */
 context("Create User", () => {
  it('CreateUser should create a user and return a 201 status', async function () {
   //ARRANGE
   const newUser = {
    "username": "NEW USER",
    "email": "NEWUSER@EMAIL.COM",
    "password": "NEWUSER",
    "role": "Client"
   }

   //ACT
   const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", userManagerAuthToken).send(newUser)
   const getAllUsersResult = await chai.request(server).get(`${baseUrl}`).set("Cookie", userManagerAuthToken)

   //ASSERT
   createUserResult.should.have.status(201)
   getAllUsersResult.should.have.status(200)
   getAllUsersResult.body.users.should.have.lengthOf(5)
   getAllUsersResult.body.users[4].should.have.property("username", "NEW USER")
  })

  it('CreateUser should return 400 status if username isnt included', async function () {
   //ARRANGE
   const newUser = {
    "username": "",
    "email": "NEWUSER@EMAIL.COM",
    "password": "NEWUSER",
    "role": "Client"
   }

   //ACT
   const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", userManagerAuthToken).send(newUser)

   //ASSERT
   createUserResult.should.have.status(400)
   createUserResult.text.should.be.equal("Username, email or password was missing.")
  })

  it('CreateUser should return 400 status if email isnt included', async function () {
   //ARRANGE
   const newUser = {
    "username": "NEW USER",
    "email": "",
    "password": "NEWUSER",
    "role": "Client"
   }

   //ACT
   const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", userManagerAuthToken).send(newUser)

   //ASSERT
   createUserResult.should.have.status(400)
   createUserResult.text.should.be.equal("Username, email or password was missing.")
  })

  it('CreateUser should return 400 status if email is already in use', async function () {
   //ARRANGE
   const newUser = {
    "username": "NEW USER",
    "email": "SEEDED EMAIL",
    "password": "NEWUSER",
    "role": "Client"
   }

   //ACT
   const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", userManagerAuthToken).send(newUser)

   //ASSERT
   createUserResult.should.have.status(400)
   createUserResult.text.should.be.equal("Email is already in use.")
  })

  it('CreateUser should return 400 status if password isnt included', async function () {
   //ARRANGE
   const newUser = {
    "username": "NEW USER",
    "email": "NEWUSER@EMAIL.COM",
    "password": "",
    "role": "Client"
   }
   
   //ACT
   const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", userManagerAuthToken).send(newUser)

   //ASSERT
   createUserResult.should.have.status(400)
   createUserResult.text.should.be.equal("Username, email or password was missing.")
  })

  it('CreateUser should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const newUser = {
    "username": "NEW USER",
    "email": "NEWUSER@EMAIL.COM",
    "password": "NEWUSER",
    "role": "INVALID ROLE"
   }
   
   //ACT
   const createUserResult = await chai.request(server).post(`${baseUrl}`).send(newUser)

   //ASSERT
   createUserResult.should.have.status(401)
   createUserResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('CreateUser should return 403 if user isnt an Authoriser', async function () {
   //ARRANGE
   const newUser = {
    "username": "NEW USER",
    "email": "NEWUSER@EMAIL.COM",
    "password": "NEWUSER",
    "role": "INVALID ROLE"
   }
   
   //ACT
   const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", clientAuthToken).send(newUser)

   //ASSERT
   createUserResult.should.have.status(403)
   createUserResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })
 })

 /**
  * Tests for the UpdateRole Controller.
  */
 context("Update Role", () => {
  it('UpdateRole should return 200 and update the users role', async function () {
   //ARRANGE
   const newRoles = {roles: ["313233343536373839313138"]}
   
   //ACT
   const updatedRole = await chai.request(server).put(`${baseUrl}/${userId}`).set("Cookie", userManagerAuthToken).send(newRoles)
   
   //ASSERT
   updatedRole.should.have.status(200)
  })
  
  it('UpdateRole should return 400 if the role doesnt exist in the database', async function () {
   //ARRANGE
   const newRoles = {roles: ["61e59bba7c2128f042a44eea"]}

   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${userId}`).set("Cookie", userManagerAuthToken).send(newRoles)

   //ASSERT
   updateRoleResult.should.have.status(400)
   updateRoleResult.text.should.be.equal("The role supplied does not exist in the database.")
  })

  it('UpdateRole should return 400 if the ID passed in isnt valid', async function () {
   //ARRANGE
   const invalidId = "INVALIDID"
   const newRoles = {roles: ["313233343536373839313138"]}

   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${invalidId}`).set("Cookie", userManagerAuthToken).send(newRoles)

   //ASSERT
   updateRoleResult.should.have.status(400)
   updateRoleResult.text.should.be.equal("ID is not valid.")
  })

  it('UpdateRole should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const newRoles = {roles: ["313233343536373839313138"]}

   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${userId}`).send(newRoles)

   //ASSERT
   updateRoleResult.should.have.status(401)
   updateRoleResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('UpdateRole should return 403 if user isnt an Authoriser', async function () {
   //ARRANGE
   const newRoles = {roles: ["313233343536373839313138"]}

   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${userId}`).set("Cookie", clientAuthToken).send(newRoles)

   //ASSERT
   updateRoleResult.should.have.status(403)
   updateRoleResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })

  it('UpdateRole should return 404 if the user doesnt exist in the database', async function () {
   //ARRANGE
   const invalidId = "61e59bba7c2128f042a44eea"
   const newRoles = {roles: ["313233343536373839313138"]}

   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${invalidId}`).set("Cookie", userManagerAuthToken).send(newRoles)

   //ASSERT
   updateRoleResult.should.have.status(404)
   updateRoleResult.text.should.be.equal("User does not exist in the database.")
  })
 })

 /**
  * Tests for the DeleteUser Controller.
  */
 context("Delete User", () => {
  it('DeleteUser should return 200 and delete the user', async function () {
   //ARRANGE
   //ACT
   const deleteResult = await chai.request(server).delete(`${baseUrl}/${userId}`).set("Cookie", userManagerAuthToken).send()
   const getAllUsersResult = (await chai.request(server).get(`${baseUrl}`).set("Cookie", userManagerAuthToken)).body

   //ASSERT
   deleteResult.should.have.status(200)
   getAllUsersResult.users.should.be.lengthOf(3)
  })

  it('DeleteUser should return a 400 status if the ID passed isnt valid', async function () {
   //ARRANGE
   const fakeId = "FAKE ID"

   //ACT
   const deleteResult = await chai.request(server).delete(`${baseUrl}/${fakeId}`).set("Cookie", userManagerAuthToken).send()

   //ASSERT
   deleteResult.should.have.status(400)
   deleteResult.text.should.be.equal("ID is not valid.")
  })

  it('DeleteUser should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   //ACT
   const deleteResult = await chai.request(server).delete(`${baseUrl}/${userId}`).send()

   //ASSERT
   deleteResult.should.have.status(401)
   deleteResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('DeleteUser should return 403 if user isnt a User Manager', async function () {
   //ARRANGE
   //ACT
   const deleteResult = await chai.request(server).delete(`${baseUrl}/${userId}`).set("Cookie", clientAuthToken).send()

   //ASSERT
   deleteResult.should.have.status(403)
   deleteResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })

  it('DeleteUser should return 404 if the ID passed doesnt exist in the database', async function () {
   //ARRANGE
   const id = "61e59bba7c2128f042a44eea"

   //ACT
   const deleteResult = await chai.request(server).delete(`${baseUrl}/${id}`).set("Cookie", userManagerAuthToken).send()

   //ASSERT
   deleteResult.should.have.status(404)
   deleteResult.text.should.be.equal("User does not exist in the database.")
  })
 })

 /**
  * Tests for the SignIn Controller.
  */
 context("Signin", () => {
  it('SignIn should return 200 and set authentication cookie', async function () {
   //ARRANGE
   const signInDetails = {
    "email": "SEEDED EMAIL",
    "password": "SEEDED PASSWORD"
   }

   //ACT
   const signInResult = await chai.request(server).post(`${baseUrl}/sign-in`).send(signInDetails)

   //ASSERT
   signInResult.should.have.status(200)
   signInResult.headers.should.have.property("set-cookie")
  })

  it('SignIn should return 401 if email isnt included', async function () {
   //ARRANGE
   const signInDetails = {
    "email": "",
    "password": "NEW PASSWORD"
   }

   //ACT
   const signInResult = await chai.request(server).post(`${baseUrl}/sign-in`).send(signInDetails)

   //ASSERT
   signInResult.should.have.status(401)
   signInResult.text.should.be.equal("Your email or password is invalid, please try again.")
  })

  it('SignIn should return 401 if password isnt included', async function () {
   //ARRANGE
   const signInDetails = {
    "email": "NEW USERS EMAIL",
    "password": ""
   }

   //ACT
   const signInResult = await chai.request(server).post(`${baseUrl}/sign-in`).send(signInDetails)

   //ASSERT
   signInResult.should.have.status(401)
   signInResult.text.should.be.equal("Your email or password is invalid, please try again.")
  })
 })

 /**
  * Tests for the SignOut Controller.
  */
 context("SignOut", () => {
  it('SignOut should return 200 and delete the access token cookie', async function () {
   const signOutResult = await chai.request(server).post(`${baseUrl}/sign-out`).set("Cookie", clientAuthToken).send()

   signOutResult.should.have.status(200)
   signOutResult.headers['set-cookie'][0].should.equal('access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
  })

  it('SignOut should return 401 if the user isnt authenticated', async function () {
   const signOutResult = await chai.request(server).post(`${baseUrl}/sign-out`).send()

   signOutResult.should.have.status(401)
   signOutResult.text.should.be.equal("The provided token is invalid or has expired.")
  })
 })

 /**
  * Tests for the SignUp Controller.
  */
 context("SignUp", () => {
  it('SignUp should create a user and return a 201 status', async function () {
   const newUser = {
    "username": "NEW USER",
    "email": "NEWUSER@EMAIL.COM",
    "password": "NEWUSER"
   }
   const createUserResult = await chai.request(server).post(`${baseUrl}/sign-up`).send(newUser)

   createUserResult.should.have.status(201)
  })

  it('SignUp should return 400 status if username isnt included', async function () {
   const newUser = {
    "username": "",
    "email": "NEWUSER@EMAIL.COM",
    "password": "NEWUSER"
   }
   const createUserResult = await chai.request(server).post(`${baseUrl}/sign-up`).send(newUser)

   createUserResult.should.have.status(400)
   createUserResult.text.should.be.equal("Username, email or password was missing.")
  })

  it('SignUp should return 400 status if email isnt included', async function () {
   const newUser = {
    "username": "NEW USER",
    "email": "",
    "password": "NEWUSER"
   }
   const createUserResult = await chai.request(server).post(`${baseUrl}/sign-up`).send(newUser)

   createUserResult.should.have.status(400)
   createUserResult.text.should.be.equal("Username, email or password was missing.")
  })

  it('SignUp should return 400 status if email is already in use', async function () {
   const newUser = {
    "username": "NEW USER",
    "email": "SEEDED EMAIL",
    "password": "NEWUSER"
   }
   const createUserResult = await chai.request(server).post(`${baseUrl}/sign-up`).send(newUser)

   createUserResult.should.have.status(400)
   createUserResult.text.should.be.equal("Email is already in use.")
  })

  it('SignUp should return 400 status if password isnt included', async function () {
   const newUser = {
    "username": "NEW USER",
    "email": "NEWUSER@EMAIL.COM",
    "password": ""
   }
   const createUserResult = await chai.request(server).post(`${baseUrl}/sign-up`).send(newUser)

   createUserResult.should.have.status(400)
   createUserResult.text.should.be.equal("Username, email or password was missing.")
  })
 })

 /**
  * Clears and seeds the in memory database before each test is ran.
  */
 beforeEach("Initialise Database", async function () {
  //Reset the database after each test
  await dbConfig.clearTestDb()
  await dbConfig.seedTestData()
 })

 /**
  * Creates Authentication tokens to be used within the tests
  */
 before("Authenticate", async function () {
  userId = "313233343536373839313039"
  userManagerId = "313233343536373839313332"

  clientAuthToken = `;access_token=Bearer%20${jwt.sign({id: userId, roles: [{name: 'Client', permissions: [{name: 'ReadRequest'}, {name: 'CreateRequest'}, {name: 'UpdateRequest'}, {name: 'DeleteRequest'}]}]}, accessSecret, {})}`
  userManagerAuthToken = `;access_token=Bearer%20${jwt.sign({id: userManagerId, roles: [{name: 'UserManager', permissions: [{name: 'CreateUser'}, {name: 'UpdateUser'}, {name: 'ReadUser'}, {name: 'DeleteUser'}, {name: 'CreateRole'}, {name: 'UpdateRole'}, {name: 'ReadRole'}, {name: 'DeleteRole'}, {name: 'DeletePermission'}, {name: 'UpdatePermission'}, {name: 'CreatePermission'}, {name: 'ReadPermission'}, {name: 'GetConfig'}, {name: 'UpdateConfig'}]}]}, accessSecret, {})}`
  noPermissionsAuthToken = `;access_token=Bearer%20${jwt.sign({id: "NOTAUSER", roles: [{name: 'role', permissions: []}]}, accessSecret, {})}`
 })
})