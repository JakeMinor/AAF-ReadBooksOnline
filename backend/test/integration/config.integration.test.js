const chai = require('chai')
const server = require('../../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/admin/config'
const dbConfig = require("../../database/database.config")
const jwt = require("jsonwebtoken")
const accessSecret = require("../../config/authentication.config").AccessSecret
chai.use(require('chai-http'))

let userManagerId = ""

let userManagerAuthToken = ""
let noPermissionsAuthToken = ""

describe("Config", function () {
 /**
  * Tests for the GetAllRoles Controller.
  */
 context("Get All Config Settings", () => {
  it('GetAllConfig should return 200 and all config settings', async function () {
   //ARRANGE

   //ACT
   const getAllConfigResult = await chai.request(server).get(baseUrl).set("Cookie", userManagerAuthToken)

   //ASSERT
   getAllConfigResult.should.have.status(200)
   getAllConfigResult.body.should.have.lengthOf(1)
   getAllConfigResult.body[0].should.haveOwnProperty("spendThreshold", 10)
   getAllConfigResult.body[0].should.haveOwnProperty("monthlySpendThreshold", 110)
   getAllConfigResult.body[0].should.haveOwnProperty("totalMonthlySpend", 0)

  })

  it('GetAllConfig should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   //ACT
   const getAllConfigResult = await chai.request(server).get(`${baseUrl}`)

   //ASSERT
   getAllConfigResult.should.have.status(401)
   getAllConfigResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('GetAllConfig should return 403 if user doesnt have the correct permissions', async function () {
   //ARRANGE
   //ACT
   const getAllConfigResult = await chai.request(server).get(`${baseUrl}`).set("Cookie", noPermissionsAuthToken)

   //ASSERT
   getAllConfigResult.should.have.status(403)
   getAllConfigResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })
 })
 
 /**
  * Tests for the UpdateRole Controller.
  */
 context("Update Config Settings", () => {
  it('UpdateConfig should return a 200 status and update the permission', async function () {
   //ARRANGE
   const configId = "313233343536373839313335"
   const updatedConfig = {
    spendThreshold: 12,
    monthlySpendThreshold: 12,
    totalMonthlySpend: 12
   }

   //ACT
   const updateConfigResult = await chai.request(server).put(`${baseUrl}/${configId}`).set("Cookie", userManagerAuthToken).send(updatedConfig)

   //ASSERT
   updateConfigResult.should.have.status(200)
   updateConfigResult.body.spendThreshold.should.equal(12)
   updateConfigResult.body.monthlySpendThreshold.should.equal(12)
   updateConfigResult.body.totalMonthlySpend.should.equal(12)
  })

  it('UpdateConfig should return 400 if the ID passed in isnt valid', async function () {
   //ARRANGE
   const invalidId = "INVALIDID"
   const updateRole = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION",
    permissions: []
   }

   //ACT
   const updateConfigResult = await chai.request(server).put(`${baseUrl}/${invalidId}`).set("Cookie", userManagerAuthToken).send(updateRole)

   //ASSERT
   updateConfigResult.should.have.status(400)
   updateConfigResult.text.should.be.equal("ID is not valid.")
  })

  it('UpdateConfig should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const roleId = "313233343536373839313335"
   const updateRole = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION",
    permissions: []
   }

   //ACT
   const updateConfigResult = await chai.request(server).put(`${baseUrl}/${roleId}`).send(updateRole)

   //ASSERT
   updateConfigResult.should.have.status(401)
   updateConfigResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('UpdateConfig should return a 403 if user doesnt have the correct permissions to update', async function () {
   //ARRANGE
   const roleId = "313233343536373839313335"
   const updateRole = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION",
    permissions: []
   }


   //ACT
   const updateConfigResult = await chai.request(server).put(`${baseUrl}/${roleId}`).set("Cookie", noPermissionsAuthToken).send(updateRole)

   //ASSERT
   updateConfigResult.should.have.status(403)
   updateConfigResult.text.should.be.equal("You do not have the correct permission to access this content.")
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
  userManagerId = "313233343536373839313332"

  userManagerAuthToken = `;access_token=Bearer%20${jwt.sign({id: userManagerId, roles: [{name: 'UserManager', permissions: [{name: 'CreateUser'}, {name: 'UpdateUser'}, {name: 'ReadUser'}, {name: 'DeleteUser'}, {name: 'CreateRole'}, {name: 'UpdateRole'}, {name: 'ReadRole'}, {name: 'DeleteRole'}, {name: 'DeletePermission'}, {name: 'UpdatePermission'}, {name: 'CreatePermission'}, {name: 'ReadPermission'}, {name: 'GetConfig'}, {name: 'UpdateConfig'}]}]}, accessSecret, {})}`
  noPermissionsAuthToken = `;access_token=Bearer%20${jwt.sign({id: "NOTAUSER", roles: [{name: 'role', permissions: []}]}, accessSecret, {})}`
 })
})