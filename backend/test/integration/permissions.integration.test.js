const chai = require('chai')
const server = require('../../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/admin/permission'
const dbConfig = require("../../database/database.config")
const jwt = require("jsonwebtoken")
const accessSecret = require("../../config/authentication.config").AccessSecret
chai.use(require('chai-http'))

let userManagerId = ""

let userManagerAuthToken = ""
let noPermissionsAuthToken = ""

describe("Permission", function () {
 /**
  * Tests for the GetAllRequests Controller.
  */
 context("Get All Permissions", () => {
  it('GetAllPermissions should return 200 and all permissions', async function () {
   //ARRANGE

   //ACT
   const getAllPermissionsResult = await chai.request(server).get(baseUrl).set("Cookie", userManagerAuthToken)

   //ASSERT
   getAllPermissionsResult.should.have.status(200)
   getAllPermissionsResult.body.count.should.equal(23)
   getAllPermissionsResult.body.permissions.should.be.lengthOf(23)
  })
  
  it('GetAllPermissions should return 200 and one permission if the limit filter is one', async function () {
   //ARRANGE
   const limit = 1

   //ACT
   const getAllPermissionsResult = await chai.request(server).get(`${baseUrl}?limit=${limit}`).set("Cookie", userManagerAuthToken)

   //ASSERT
   getAllPermissionsResult.should.have.status(200)
   getAllPermissionsResult.body.count.should.equal(23)
   getAllPermissionsResult.body.permissions.should.be.lengthOf(1)
  })

  it('GetAllPermissions should return 200 and no permissions if the offset is one', async function () {
   //ARRANGE
   const offset = 1

   //ACT
   const getAllPermissionsResult = await chai.request(server).get(`${baseUrl}?offset=${offset}`).set("Cookie", userManagerAuthToken)

   //ASSERT
   getAllPermissionsResult.should.have.status(200)
   getAllPermissionsResult.body.count.should.equal(23)
   getAllPermissionsResult.body.permissions.should.be.lengthOf(0)
  })

  it('GetAllPermissions should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   //ACT
   const getAllPermissionsResult = await chai.request(server).get(`${baseUrl}`)

   //ASSERT
   getAllPermissionsResult.should.have.status(401)
   getAllPermissionsResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('GetAllPermissions should return 403 if user doesnt have the correct permissions', async function () {
   //ARRANGE
   //ACT
   const getAllPermissionsResult = await chai.request(server).get(`${baseUrl}`).set("Cookie", noPermissionsAuthToken)

   //ASSERT
   getAllPermissionsResult.should.have.status(403)
   getAllPermissionsResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })
 })

 /**
  * Tests for the GetPermissionByName Controller.
  */
 context("Get Permission By Name", () => {
  it('GetPermissionByName should return a permission and a 200 status', async function () {
   //ARRANGE
   const permissionName = "ReadRequest"
   
   //ACT
   const getPermissionByNameResult = await chai.request(server).get(`${baseUrl}/${permissionName}`).set("Cookie", userManagerAuthToken)
   //ASSERT
   getPermissionByNameResult.should.have.status(200)
   getPermissionByNameResult.body.should.have.property("name", "ReadRequest")
  })

  it('GetPermissionByName should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const permissionName = "PERMISSIONNAME"

   //ACT
   const getPermissionByNameResult = await chai.request(server).get(`${baseUrl}/${permissionName}`)

   //ASSERT
   getPermissionByNameResult.should.have.status(401)
   getPermissionByNameResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('GetPermissionByName should return 404 if the ID passed in doesnt exist in the database', async function () {
   //ARRANGE
   const permissionName = "PERMISSIONNAME"

   //ACT
   const getPermissionByNameResult = await chai.request(server).get(`${baseUrl}/${permissionName}`).set("Cookie", userManagerAuthToken)

   //ASSERT
   getPermissionByNameResult.should.have.status(404)
   getPermissionByNameResult.text.should.be.equal("No data found.")
  })
 })
 
 /**
  * Tests for the CreatePermission Controller.
  */
 context("Create Permission", () => {
  it('CreatePermission should create a permission and return a 201 status', async function () {
   //ARRANGE
   const newPermission = {
    "name": "PERMISSION NAME",
    "description": "PERMISSION DESCRIPTION"
   }

   //ACT
   const createPermissionResult = await chai.request(server).post(baseUrl).set("Cookie", userManagerAuthToken).send(newPermission)

   //ASSERT
   createPermissionResult.should.have.status(201)
  })

  it('CreatePermission should return a 400 if the name isnt included', async function () {
   //ARRANGE
   const newPermission = {
    "name": "",
    "description": "PERMISSION DESCRIPTION"
   }

   //ACT
   const createPermissionResult = await chai.request(server).post(baseUrl).set("Cookie", userManagerAuthToken).send(newPermission)

   //ASSERT
   createPermissionResult.should.have.status(400)
   createPermissionResult.text.should.be.equal("Data was missing or invalid.")
  })
  

  it('CreatePermission should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const newPermission = {
    "name": "PERMISSION NAME",
    "description": "PERMISSION DESCRIPTION"
   }

   //ACT
   const createPermissionResult = await chai.request(server).post(baseUrl).send(newPermission)

   //ASSERT
   createPermissionResult.should.have.status(401)
   createPermissionResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('CreatePermission should return 403 if user doesnt have the correct permissions', async function () {
   //ARRANGE
   const newPermission = {
    "name": "PERMISSION NAME",
    "description": "PERMISSION DESCRIPTION"
   }

   //ACT
   const createPermissionResult = await chai.request(server).post(baseUrl).set("Cookie", noPermissionsAuthToken).send(newPermission)

   //ASSERT
   createPermissionResult.should.have.status(403)
   createPermissionResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })
 })

 /**
  * Tests for the UpdatePermission Controller.
  */
 context("Update Permission", () => {
  it('UpdatePermission should return a 200 status and update the permission', async function () {
   //ARRANGE
   const permissionId = "313233343536373839313031"
   const updatedPermission = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION"
   }

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${permissionId}`).set("Cookie", userManagerAuthToken).send(updatedPermission)

   //ASSERT
   updateRequestResult.should.have.status(200)
   updateRequestResult.body.name.should.equal("NEW NAME")
   updateRequestResult.body.description.should.equal("NEW DESCRIPTION")
  })

  it('UpdatePermission should return 400 if the ID passed in isnt valid', async function () {
   //ARRANGE
   const invalidId = "INVALIDID"
   const updatedPermission = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION"
   }
   
   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${invalidId}`).set("Cookie", userManagerAuthToken).send(updatedPermission)

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("ID is not valid.")
  })

  it('UpdatePermission should return a 400 if the name isnt included', async function () {
   //ARRANGE
   const permissionId = "313233343536373839313031"
   const updatedPermission = {
    name: "",
    description: "NEW DESCRIPTION"
   }

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${permissionId}`).set("Cookie", userManagerAuthToken).send(updatedPermission)

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('UpdatePermission should return a 400 if the name is already taken', async function () {
   //ARRANGE
   const permissionId = "313233343536373839313031"
   const updatedPermission = {
    name: "ReadRequest",
    description: "NEW DESCRIPTION"
   }

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${permissionId}`).set("Cookie", userManagerAuthToken).send(updatedPermission)

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("Permission with the name ReadRequest already exists.")
  })

  it('UpdatePermission should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const permissionId = "313233343536373839313031"
   const updatedPermission = {
    name: "ReadRequest",
    description: "NEW DESCRIPTION"
   }
   
   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${permissionId}`).send(updatedPermission)

   //ASSERT
   updateRequestResult.should.have.status(401)
   updateRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('UpdatePermission should return a 403 if user doesnt have the correct permissions to update', async function () {
   //ARRANGE
   const permissionId = "313233343536373839313031"
   const updatedPermission = {
    name: "ReadRequest",
    description: "NEW DESCRIPTION"
   }
   
   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${permissionId}`).set("Cookie", noPermissionsAuthToken).send(updatedPermission)

   //ASSERT
   updateRequestResult.should.have.status(403)
   updateRequestResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })

  it('UpdatePermission should return a 404 if the permission doesnt exist', async function () {
   //ARRANGE
   const invalidId = "61e59bba7c2128f042a44eea"
   const updatedPermission = {
    name: "NEW NAME",
    description: "NEW DESCRIPTION"
   }
   
   //ACT
   const updatePermissionResult = await chai.request(server).put(`${baseUrl}/${invalidId}`).set("Cookie", userManagerAuthToken).send(updatedPermission)

   //ASSERT
   updatePermissionResult.should.have.status(404)
   updatePermissionResult.text.should.be.equal("Permission does not exist in the database.")
  })
 })

 /**
  * Tests for the DeleteRequest Controller.
  */
 context("Delete Permission", () => {
  it('DeletePermission should delete a request and return a 200 status', async function () {
   //ARRANGE
   const permissionId = "313233343536373839313031"

   //ACT
   const deletePermissionResult = await chai.request(server).delete(`${baseUrl}/${permissionId}`).set("Cookie", userManagerAuthToken).send()
   const getAllPermissionResult = (await chai.request(server).get(baseUrl).set("Cookie", userManagerAuthToken)).body

   //ASSERT
   deletePermissionResult.should.have.status(200)
   getAllPermissionResult.permissions.should.be.lengthOf(22)
  })

  it('DeletePermission should return a 400 status if the ID passed isnt valid', async function () {
   //ARRANGE
   const fakeId = "FAKE ID"

   //ACT
   const deletePermissionResult = await chai.request(server).delete(`${baseUrl}/${fakeId}`).set("Cookie", userManagerAuthToken).send()

   //ASSERT
   deletePermissionResult.should.have.status(400)
   deletePermissionResult.text.should.be.equal("ID is not valid.")
  })

  it('DeletePermission should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const permissionId = "313233343536373839313031"

   //ACT
   const deletePermissionResult = await chai.request(server).delete(`${baseUrl}/${permissionId}`).send()

   //ASSERT
   deletePermissionResult.should.have.status(401)
   deletePermissionResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('DeletePermission should return 404 if the ID passed doesnt exist in the database', async function () {
   //ARRANGE
   const id = "61e59bba7c2128f042a44eea"

   //ACT
   const deletePermissionResult = await chai.request(server).delete(`${baseUrl}/${id}`).set("Cookie", userManagerAuthToken).send()

   //ASSERT
   deletePermissionResult.should.have.status(404)
   deletePermissionResult.text.should.be.equal("No data found.")
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