const chai = require('chai')
const server = require('../../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/admin/role'
const dbConfig = require("../../database/database.config")
const jwt = require("jsonwebtoken")
const accessSecret = require("../../config/authentication.config").AccessSecret
chai.use(require('chai-http'))

let userManagerId = ""

let userManagerAuthToken = ""
let noPermissionsAuthToken = ""

describe("Role", function () {
 /**
  * Tests for the GetAllRoles Controller.
  */
 context("Get All Roles", () => {
  it('GetAllRoles should return 200 and all roles', async function () {
   //ARRANGE

   //ACT
   const getAllRolesResult = await chai.request(server).get(baseUrl).set("Cookie", userManagerAuthToken)

   //ASSERT
   getAllRolesResult.should.have.status(200)
   getAllRolesResult.body.count.should.equal(4)
   getAllRolesResult.body.roles.should.be.lengthOf(4)
  })

  it('GetAllRoles should return 200 and one permission if the limit filter is one', async function () {
   //ARRANGE
   const limit = 1

   //ACT
   const getAllRolesResult = await chai.request(server).get(`${baseUrl}?limit=${limit}`).set("Cookie", userManagerAuthToken)

   //ASSERT
   getAllRolesResult.should.have.status(200)
   getAllRolesResult.body.count.should.equal(4)
   getAllRolesResult.body.roles.should.be.lengthOf(1)
  })

  it('GetAllRoles should return 200 and no permissions if the offset is one', async function () {
   //ARRANGE
   const offset = 1

   //ACT
   const getAllRolesResult = await chai.request(server).get(`${baseUrl}?offset=${offset}`).set("Cookie", userManagerAuthToken)

   //ASSERT
   getAllRolesResult.should.have.status(200)
   getAllRolesResult.body.count.should.equal(4)
   getAllRolesResult.body.roles.should.be.lengthOf(0)
  })

  it('GetAllRoles should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   //ACT
   const getAllRolesResult = await chai.request(server).get(`${baseUrl}`)

   //ASSERT
   getAllRolesResult.should.have.status(401)
   getAllRolesResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('GetAllRoles should return 403 if user doesnt have the correct permissions', async function () {
   //ARRANGE
   //ACT
   const getAllRolesResult = await chai.request(server).get(`${baseUrl}`).set("Cookie", noPermissionsAuthToken)

   //ASSERT
   getAllRolesResult.should.have.status(403)
   getAllRolesResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })
 })

 /**
  * Tests for the GetRoleByName Controller.
  */
 context("Get Role By Name", () => {
  it('GetRoleByName should return a permission and a 200 status', async function () {
   //ARRANGE
   const roleName = "Client"

   //ACT
   const getRoleByNameResult = await chai.request(server).get(`${baseUrl}/${roleName}`).set("Cookie", userManagerAuthToken)
   //ASSERT
   getRoleByNameResult.should.have.status(200)
   getRoleByNameResult.body.should.have.property("name", "Client")
  })

  it('GetRoleByName should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const roleName = "ROLENAME"

   //ACT
   const getRoleByNameResult = await chai.request(server).get(`${baseUrl}/${roleName}`)

   //ASSERT
   getRoleByNameResult.should.have.status(401)
   getRoleByNameResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('GetRoleByName should return 404 if the ID passed in doesnt exist in the database', async function () {
   //ARRANGE
   const roleName = "ROLENAME"

   //ACT
   const getRoleByNameResult = await chai.request(server).get(`${baseUrl}/${roleName}`).set("Cookie", userManagerAuthToken)

   //ASSERT
   getRoleByNameResult.should.have.status(404)
   getRoleByNameResult.text.should.be.equal("No data found.")
  })
 })

 /**
  * Tests for the CreateRole Controller.
  */
 context("Create Role", () => {
  it('CreateRole should create a permission and return a 201 status', async function () {
   //ARRANGE
   const newRole = {
    name: "ROLE NAME",
    description: "ROLE DESCRIPTION",
    permissions: ["313233343536373839313031"]
   }

   //ACT
   const createRoleResult = await chai.request(server).post(baseUrl).set("Cookie", userManagerAuthToken).send(newRole)

   //ASSERT
   createRoleResult.should.have.status(201)
  })

  it('CreateRole should return a 400 if the name isnt included', async function () {
   //ARRANGE
   const newRole = {
    name: "", 
    description: "ROLE DESCRIPTION",
    permissions: []
   }

   //ACT
   const createRoleResult = await chai.request(server).post(baseUrl).set("Cookie", userManagerAuthToken).send(newRole)

   //ASSERT
   createRoleResult.should.have.status(400)
   createRoleResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('CreateRole should return a 400 if the name is already taken', async function () {
   //ARRANGE
   const newRole = {
    name: "Client",
    description: "ROLE DESCRIPTION",
    permissions: []
   }

   //ACT
   const updateRequestResult = await chai.request(server).post(`${baseUrl}`).set("Cookie", userManagerAuthToken).send(newRole)

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("Role with the name Client already exists.")
  })

  it('CreateRole should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const newRole = {
    name: "ROLE NAME",
    description: "ROLE DESCRIPTION",
    permissions: []
   }
   
   //ACT
   const createRoleResult = await chai.request(server).post(baseUrl).send(newRole)

   //ASSERT
   createRoleResult.should.have.status(401)
   createRoleResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('CreateRole should return 403 if user doesnt have the correct permissions', async function () {
   //ARRANGE
   const newRole = {
    name: "ROLE NAME",
    description: "ROLE DESCRIPTION",
    permissions: []
   }

   //ACT
   const createRoleResult = await chai.request(server).post(baseUrl).set("Cookie", noPermissionsAuthToken).send(newRole)

   //ASSERT
   createRoleResult.should.have.status(403)
   createRoleResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })
 })

 /**
  * Tests for the UpdateRole Controller.
  */
 context("Update Role", () => {
  it('UpdateRole should return a 200 status and update the permission', async function () {
   //ARRANGE
   const roleId = "313233343536373839313036"
   const updateRole = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION",
    permissions: ["313233343536373839313031"]
   }

   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${roleId}`).set("Cookie", userManagerAuthToken).send(updateRole)

   //ASSERT
   updateRoleResult.should.have.status(200)
   updateRoleResult.body.name.should.equal("NEW NAME")
   updateRoleResult.body.description.should.equal("NEW DESCRIPTION")
  })

  it('UpdateRole should return 400 if the ID passed in isnt valid', async function () {
   //ARRANGE
   const invalidId = "INVALIDID"
   const updateRole = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION",
    permissions: []
   }

   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${invalidId}`).set("Cookie", userManagerAuthToken).send(updateRole)

   //ASSERT
   updateRoleResult.should.have.status(400)
   updateRoleResult.text.should.be.equal("ID is not valid.")
  })

  it('UpdateRole should return a 400 if the name isnt included', async function () {
   //ARRANGE
   const roleId = "313233343536373839313036"
   const updateRole = {
    name: "",
    description: "NEW DESCRIPTION",
    permissions: []
   }

   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${roleId}`).set("Cookie", userManagerAuthToken).send(updateRole)

   //ASSERT
   updateRoleResult.should.have.status(400)
   updateRoleResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('UpdateRole should return a 400 if the name is already taken', async function () {
   //ARRANGE
   const roleId = "313233343536373839313036"
   const updateRole = {
    name: "Client",
    description: "NEW DESCRIPTION",
    permissions: []
   }

   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${roleId}`).set("Cookie", userManagerAuthToken).send(updateRole)

   //ASSERT
   updateRoleResult.should.have.status(400)
   updateRoleResult.text.should.be.equal("Role with the name Client already exists.")
  })

  it('UpdateRole should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const roleId = "313233343536373839313036"
   const updateRole = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION",
    permissions: []
   }

   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${roleId}`).send(updateRole)

   //ASSERT
   updateRoleResult.should.have.status(401)
   updateRoleResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('UpdateRole should return a 403 if user doesnt have the correct permissions to update', async function () {
   //ARRANGE
   const roleId = "313233343536373839313036"
   const updateRole = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION",
    permissions: []
   }


   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${roleId}`).set("Cookie", noPermissionsAuthToken).send(updateRole)

   //ASSERT
   updateRoleResult.should.have.status(403)
   updateRoleResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })

  it('UpdateRole should return a 404 if the role doesnt exist', async function () {
   //ARRANGE
   const roleId = "61e59bba7c2128f042a44eea"
   const updateRole = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION",
    permissions: []
   }


   //ACT
   const updateRoleResult = await chai.request(server).put(`${baseUrl}/${roleId}`).set("Cookie", userManagerAuthToken).send(updateRole)

   //ASSERT
   updateRoleResult.should.have.status(404)
   updateRoleResult.text.should.be.equal("Role does not exist in the database.")
  })
 })

 /**
  * Tests for the DeleteRole Controller.
  */
 context("Delete Role", () => {
  it('DeleteRole should delete a role and return a 200 status', async function () {
   //ARRANGE
   const roleId = "313233343536373839313036"

   //ACT
   const deleteRoleResult = await chai.request(server).delete(`${baseUrl}/${roleId}`).set("Cookie", userManagerAuthToken).send()
   const getAllRolesResult = (await chai.request(server).get(baseUrl).set("Cookie", userManagerAuthToken)).body

   //ASSERT
   deleteRoleResult.should.have.status(200)
   getAllRolesResult.roles.should.be.lengthOf(3)
  })

  it('DeleteRole should return a 400 status if the ID passed isnt valid', async function () {
   //ARRANGE
   const fakeId = "FAKE ID"

   //ACT
   const deleteRoleResult = await chai.request(server).delete(`${baseUrl}/${fakeId}`).set("Cookie", userManagerAuthToken).send()

   //ASSERT
   deleteRoleResult.should.have.status(400)
   deleteRoleResult.text.should.be.equal("ID is not valid.")
  })

  it('DeleteRole should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const permissionId = "313233343536373839313031"

   //ACT
   const deleteRoleResult = await chai.request(server).delete(`${baseUrl}/${permissionId}`).send()

   //ASSERT
   deleteRoleResult.should.have.status(401)
   deleteRoleResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('DeleteRole should return 404 if the ID passed doesnt exist in the database', async function () {
   //ARRANGE
   const id = "61e59bba7c2128f042a44eea"

   //ACT
   const deleteRoleResult = await chai.request(server).delete(`${baseUrl}/${id}`).set("Cookie", userManagerAuthToken).send()

   //ASSERT
   deleteRoleResult.should.have.status(404)
   deleteRoleResult.text.should.be.equal("Role does not exist in the database.")
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