const chai = require('chai')
const server = require('../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/user/'
const dbConfig = require("../database/database.config")
const jwt = require("jsonwebtoken")
const accessSecret = require("../config/authentication.config").AccessSecret
chai.use(require('chai-http'))
let userId = ""
let clientAuthToken = ""
let authoriserAuthToken = ""

describe("User", function () {
 //AUTHENTICATION WITH AUTHORISER ROLE REQUIRED
 //GET ALL USERS
 it('GetAllUsers should return 200 and all users', async function () {
  const getAllUsersResult = await chai.request(server).get(`${baseUrl}`).set("Cookie", authoriserAuthToken)
  
  getAllUsersResult.should.have.status(200)
  getAllUsersResult.body.should.have.lengthOf(1)
 })
 
 it('GetAllUsers should return 401 if user isnt authenticated', async function () {
  const getAllUsersResult = await chai.request(server).get(`${baseUrl}`)

  getAllUsersResult.should.have.status(401)
  getAllUsersResult.text.should.be.equal("The provided token is invalid or has expired.")
 })

 it('GetAllUsers should return 403 if user isnt an Authoriser', async function () {
  const getAllUsersResult = await chai.request(server).get(`${baseUrl}`).set("Cookie", clientAuthToken)

  getAllUsersResult.should.have.status(403)
  getAllUsersResult.text.should.be.equal("You do not have the correct permissions to access this content.")
 })
 
 //GET USER BY ID
 it('GetUserById should return a user and a 200 status', async function () {
  const getByIDResult = await chai.request(server).get(`${baseUrl}${userId}`).set("Cookie", authoriserAuthToken)

  getByIDResult.should.have.status(200)
  getByIDResult.body.should.have.property("username", "SEEDED USER")
 })

 it('GetUserById should return 400 if the ID passed in isnt valid', async function () {
  const invalidId = "INVALIDID"
  
  const getByIDResult = await chai.request(server).get(`${baseUrl}${invalidId}`).set("Cookie", authoriserAuthToken)

  getByIDResult.should.have.status(400)
  getByIDResult.text.should.be.equal("ID is not valid.")
 })

 it('GetUserById should return 401 if user isnt authenticated', async function () {
  const getByIDResult = await chai.request(server).get(`${baseUrl}${userId}`)

  getByIDResult.should.have.status(401)
  getByIDResult.text.should.be.equal("The provided token is invalid or has expired.")
 })

 it('GetUserById should return 403 if user isnt an Authoriser', async function () {
  const getByIDResult = await chai.request(server).get(`${baseUrl}${userId}`).set("Cookie", clientAuthToken)

  getByIDResult.should.have.status(403)
  getByIDResult.text.should.be.equal("You do not have the correct permissions to access this content.")
 })
 
 it('GetUserById should return 404 if the ID passed in doesnt exist in the database', async function () {
  const invalidId = "61e59bba7c2128f042a44eea"
  
  const getByIDResult = await chai.request(server).get(`${baseUrl}${invalidId}`).set("Cookie", authoriserAuthToken)

  getByIDResult.should.have.status(404)
  getByIDResult.text.should.be.equal("No data found.")
 })
 
 //CREATE USER
 it('CreateUser should create a user and return a 201 status', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "NEWUSER@EMAIL.COM",
   "password": "NEWUSER",
   "role": "Client"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", authoriserAuthToken).send(newUser)
  const getAllUsersResult = await chai.request(server).get(`${baseUrl}`).set("Cookie", authoriserAuthToken)

  createUserResult.should.have.status(201)
  getAllUsersResult.should.have.status(200)
  getAllUsersResult.body.should.have.lengthOf(2)
  getAllUsersResult.body[1].should.have.property("username", "NEW USER")
 })

 it('CreateUser should return 400 status if username isnt included', async function () {
  const newUser = {
   "username": "",
   "email": "NEWUSER@EMAIL.COM",
   "password": "NEWUSER",
   "role": "Client"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", authoriserAuthToken).send(newUser)

  createUserResult.should.have.status(400)
  createUserResult.text.should.be.equal("Username, email or password was missing.")
 })

 it('CreateUser should return 400 status if email isnt included', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "",
   "password": "NEWUSER",
   "role": "Client"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", authoriserAuthToken).send(newUser)

  createUserResult.should.have.status(400)
  createUserResult.text.should.be.equal("Username, email or password was missing.")
 })

 it('CreateUser should return 400 status if email is already in use', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "SEEDED EMAIL",
   "password": "NEWUSER",
   "role": "Client"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", authoriserAuthToken).send(newUser)

  createUserResult.should.have.status(400)
  createUserResult.text.should.be.equal("Email is already in use.")
 })

 it('CreateUser should return 400 status if password isnt included', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "NEWUSER@EMAIL.COM",
   "password": "",
   "role": "Client"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", authoriserAuthToken).send(newUser)

  createUserResult.should.have.status(400)
  createUserResult.text.should.be.equal("Username, email or password was missing.")
 })

 it('CreateUser should return 400 status if role isnt included', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "NEWUSER@EMAIL.COM",
   "password": "NEWUSER",
   "role": ""
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", authoriserAuthToken).send(newUser)

  createUserResult.should.have.status(400)
  createUserResult.text.should.be.equal("Invalid role, the supplied role should be either Client, Employee or Authoriser.")
 })

 it('CreateUser should return 400 status if role isnt a valid role', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "NEWUSER@EMAIL.COM",
   "password": "NEWUSER",
   "role": "INVALID ROLE"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", authoriserAuthToken).send(newUser)

  createUserResult.should.have.status(400)
  createUserResult.text.should.be.equal("Invalid role, the supplied role should be either Client, Employee or Authoriser.")
 })

 it('CreateUser should return 401 if user isnt authenticated', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "NEWUSER@EMAIL.COM",
   "password": "NEWUSER",
   "role": "INVALID ROLE"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}`).send(newUser)

  createUserResult.should.have.status(401)
  createUserResult.text.should.be.equal("The provided token is invalid or has expired.")
 })

 it('CreateUser should return 403 if user isnt an Authoriser', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "NEWUSER@EMAIL.COM",
   "password": "NEWUSER",
   "role": "INVALID ROLE"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", clientAuthToken).send(newUser)

  createUserResult.should.have.status(403)
  createUserResult.text.should.be.equal("You do not have the correct permissions to access this content.")
 })
 
 //UPDATE ROLE
 it('UpdateRole should return 200 and update the users role', async function () {
  const newRole = {role: "Employee"}

  const oldRole = (await chai.request(server).get(`${baseUrl}${userId}`).set("Cookie", authoriserAuthToken)).body.role

  const updatedRole = await chai.request(server).put(`${baseUrl}${userId}`).set("Cookie", authoriserAuthToken).send(newRole)

  updatedRole.should.have.status(200)
  oldRole.should.be.not.equal(updatedRole.body.role)
  updatedRole.body.role.should.be.equal(newRole.role)
 })

 it('UpdateRole should return 400 if the ID passed in isnt valid', async function () {
  const invalidId = "INVALIDID"
  const newRole = {role: "Employee"}
  
  const updateRoleResult = await chai.request(server).put(`${baseUrl}${invalidId}`).set("Cookie", authoriserAuthToken).send(newRole)

  updateRoleResult.should.have.status(400)
  updateRoleResult.text.should.be.equal("ID is not valid.")
 })

 it('UpdateRole should return 401 if user isnt authenticated', async function () {
  const newRole = {role: "Employee"}

  const updateRoleResult = await chai.request(server).put(`${baseUrl}${userId}`).send(newRole)

  updateRoleResult.should.have.status(401)
  updateRoleResult.text.should.be.equal("The provided token is invalid or has expired.")
 })

 it('UpdateRole should return 403 if user isnt an Authoriser', async function () {
  const newRole = {role: "Employee"}

  const updateRoleResult = await chai.request(server).put(`${baseUrl}${userId}`).set("Cookie", clientAuthToken).send(newRole)

  updateRoleResult.should.have.status(403)
  updateRoleResult.text.should.be.equal("You do not have the correct permissions to access this content.")
 })
 
 it('UpdateRole should return 404 if the ID passed in doesnt exist in the database', async function () {
  const invalidId = "61e59bba7c2128f042a44eea"
  const newRole = {role: "Employee"}

  const updateRoleResult = await chai.request(server).put(`${baseUrl}${invalidId}`).set("Cookie", authoriserAuthToken).send(newRole)

  updateRoleResult.should.have.status(404)
  updateRoleResult.text.should.be.equal("No data found.")
 })

 //DELETE USER
 it('DeleteUser should return 200 and delete the user', async function () {
  const deleteResult = await chai.request(server).delete(`${baseUrl}${userId}`).set("Cookie", authoriserAuthToken).send()
  const getAllUsersResult = (await chai.request(server).get(`${baseUrl}`).set("Cookie", authoriserAuthToken)).body

  deleteResult.should.have.status(200)
  getAllUsersResult.should.be.lengthOf(0)
 })

 it('DeleteUser should return a 400 status if the ID passed isnt valid', async function () {
  const fakeId = "FAKE ID"

  const deleteResult = await chai.request(server).delete(`${baseUrl}${fakeId}`).set("Cookie", authoriserAuthToken).send()

  deleteResult.should.have.status(400)
  deleteResult.text.should.be.equal("ID is not valid.")
 })

 it('DeleteUser should return 401 if user isnt authenticated', async function () {
  const deleteResult = await chai.request(server).delete(`${baseUrl}${userId}`).send()

  deleteResult.should.have.status(401)
  deleteResult.text.should.be.equal("The provided token is invalid or has expired.")
 })

 it('DeleteUser should return 403 if user isnt an Authoriser', async function () {
  const deleteResult = await chai.request(server).delete(`${baseUrl}${userId}`).set("Cookie", clientAuthToken).send()

  deleteResult.should.have.status(403)
  deleteResult.text.should.be.equal("You do not have the correct permissions to access this content.")
 })
 
 it('DeleteUser should return 404 if the ID passed doesnt exist in the database', async function () {
  const id = "61e59bba7c2128f042a44eea"

  const deleteResult = await chai.request(server).delete(`${baseUrl}${id}`).set("Cookie", authoriserAuthToken).send()

  deleteResult.should.have.status(404)
  deleteResult.text.should.be.equal("No data found.")
 })

 //AUTHENTICATION WITH ANY ROLE
 it('SignOut should return 200 and delete the access token cookie', async function () {
  const signOutResult = await chai.request(server).post(`${baseUrl}sign-out`).set("Cookie", clientAuthToken).send()

  signOutResult.should.have.status(200)
  signOutResult.headers['set-cookie'][0].should.equal('access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
 })

 it('SignOut should return 401 if the user isnt authenticated', async function () {
  const signOutResult = await chai.request(server).post(`${baseUrl}sign-out`).send()

  signOutResult.should.have.status(401)
  signOutResult.text.should.be.equal("The provided token is invalid or has expired.")
 })
 
 //NO ROLE OR AUTHENTICATION REQUIRED
 //SIGN IN
 it('SignIn should return 200 and set authentication cookie', async function () {
  const signInDetails = {
   "email": "SEEDED EMAIL",
   "password": "SEEDED PASSWORD"
  }

  const signInResult = await chai.request(server).post(`${baseUrl}sign-in`).send(signInDetails)
  
  signInResult.should.have.status(200)
  signInResult.headers.should.have.property("set-cookie")
 })

 it('SignIn should return 401 if email isnt included', async function () {
  const signInDetails = {
   "email": "",
   "password": "NEW PASSWORD"
  }

  const signInResult = await chai.request(server).post(`${baseUrl}sign-in`).send(signInDetails)

  signInResult.should.have.status(401)
  signInResult.text.should.be.equal("Your email or password is invalid, please try again.")
 })

 it('SignIn should return 401 if password isnt included', async function () {
  const signInDetails = {
   "email": "NEW USERS EMAIL",
   "password": ""
  }

  const signInResult = await chai.request(server).post(`${baseUrl}sign-in`).send(signInDetails)

  signInResult.should.have.status(401)
  signInResult.text.should.be.equal("Your email or password is invalid, please try again.")
 })
 
//SIGN UP
 it('SignUp should create a user and return a 201 status', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "NEWUSER@EMAIL.COM",
   "password": "NEWUSER"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}sign-up`).send(newUser)

  createUserResult.should.have.status(201)
 })

 it('SignUp should return 400 status if username isnt included', async function () {
  const newUser = {
   "username": "",
   "email": "NEWUSER@EMAIL.COM",
   "password": "NEWUSER"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}sign-up`).send(newUser)

  createUserResult.should.have.status(400)
  createUserResult.text.should.be.equal("Username, email or password was missing.")
 })

 it('SignUp should return 400 status if email isnt included', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "",
   "password": "NEWUSER"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}sign-up`).send(newUser)

  createUserResult.should.have.status(400)
  createUserResult.text.should.be.equal("Username, email or password was missing.")
 })

 it('SignUp should return 400 status if email is already in use', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "SEEDED EMAIL",
   "password": "NEWUSER"
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}sign-up`).send(newUser)

  createUserResult.should.have.status(400)
  createUserResult.text.should.be.equal("Email is already in use.")
 })

 it('SignUp should return 400 status if password isnt included', async function () {
  const newUser = {
   "username": "NEW USER",
   "email": "NEWUSER@EMAIL.COM",
   "password": ""
  }
  const createUserResult = await chai.request(server).post(`${baseUrl}sign-up`).send(newUser)

  createUserResult.should.have.status(400)
  createUserResult.text.should.be.equal("Username, email or password was missing.")
 })
 
 
 beforeEach("Initialise Database", async function () {
  await dbConfig.clearTestDb()
  userId = await dbConfig.seedTestData()
 })

 before("Authenticate", async function () {
  clientAuthToken = `Bearer%20${jwt.sign({role: "Client"}, accessSecret, {})}`
  authoriserAuthToken = `Bearer%20${jwt.sign({role: "Authoriser"}, accessSecret, {})}`
 })
})