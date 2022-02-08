const Utilities = require("../../utilities")
const ConfigBusiness = require("../../business/config")
const configBusiness = new ConfigBusiness()
const dbConfig = require("../../database/database.config")
const chai = require('chai')
const assert = chai.assert
const should = chai.should();
const expect = chai.expect
const server = require('../../app')
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(require('chai-http'))

describe('Utilities unit tests', () => {
 context('Convert to object ID', () => {
  it('Returns an objectID', () => {
   //ARRANGE
   const validId = '313233343536373839313138'
   
   //ACT
   const objectId = Utilities.convertToObjectId(validId)
   
   //ASSERT
   objectId.should.be.an('object')
   objectId.should.have.valueOf(validId)
  })
  
  it('Returns an error if the id passed in isnt valid', () => {
   //ARRANGE
   const invalidId = "INVALIDID"
   
   //ACT
   //ASSERT
   expect(() => {Utilities.convertToObjectId(invalidId)}).to.throw('ID is not valid.')
  })
 })
 
 context('Does user exist', () => {
  it('Returns an error if the user doesnt exist', async () => {
   //ARRANGE
   const userId = '313233343536373839313038'
   
   //ACT
   const error = async () => {
    await Utilities.doesUserExist(userId)
   }
   
   //ASSERT
   assert.isRejected(error(), 'User does not exist in the database.')
  })
  
  it('Doesnt return error if user does exist', async () => {
   //ARRANGE
   const userId = '313233343536373839313039'

   //ACT
   //ASSERT
   await expect(() => {Utilities.doesUserExist(userId)}).to.not.throw('User does not exist in the database.')
  })
 })

 context('Has correct permission', () => {
  it('Returns an error if the user doesnt have the correct permission', async () => {
   //ARRANGE
   const userId = '313233343536373839313039'
   const permission = 'AllocateRequest'
   
   //ACT
   const error = async () => {
    await Utilities.hasCorrectPermission(userId, permission)
   }
   
   //ASSERT
   assert.isRejected(error(), 'You do not have the correct permission to access this content.')
  })

  it('Doesnt return error if user does have the correct permission', async () => {
   //ARRANGE
   const userId = '313233343536373839313039'
   const permission = 'ReadRequest'

   //ACT
   //ASSERT
   await expect(() => {Utilities.hasCorrectPermission(userId, permission)}).to.not.throw('You do not have the correct permission to access this content.')
  })
 })

 context('Is user employee', () => {
  it('Returns an error if the user isnt an employee', async () => {
   //ARRANGE
   const userId = '313233343536373839313039'

   //ACT
   const error = async () => {
    await Utilities.isUserEmployee(userId)
   }

   //ASSERT
   assert.isRejected(error(), "User isn't an employee.")
  })

  it('Doesnt return error if user is an employee', async () => {
   //ARRANGE
   const employeeId = '313233343536373839313130'

   //ACT
   //ASSERT
   await expect(() => {Utilities.isUserEmployee(employeeId)}).to.not.throw("User isn't an employee.")
  })
 })

 context('Is user authoriser', () => {
  it('Returns an error if the user isnt an authoriser', async () => {
   //ARRANGE
   const authoriserId = '313233343536373839313131'

   //ACT
   const error = async () => {
    await Utilities.isUserAuthoriser(authoriserId)
   }

   //ASSERT
   assert.isRejected(error(), "User isn't an authoriser.")
  })

  it('Doesnt return error if user is an authoriser', async () => {
   //ARRANGE
   const employeeId = '313233343536373839313130'

   //ACT
   //ASSERT
   await expect(() => {Utilities.isUserAuthoriser(employeeId)}).to.not.throw("User isn't an authoriser.")
  })
 })

 context('Does request exist', () => {
  it('Returns an error if the request doesnt exist', async () => {
   //ARRANGE
   const invalidRequestId = '313233343536373839313131'

   //ACT
   const error = async () => {
    await Utilities.doesRequestExist(invalidRequestId)
   }

   //ASSERT
   assert.isRejected(error(), "Request does not exist in the database.")
  })

  it('Doesnt return error if request does exist', async () => {
   //ARRANGE
   const requestId = '313233343536373839313133'

   //ACT
   const request = await Utilities.doesRequestExist(requestId)
 
   //ASSERT
   request.should.not.equal(null)
  })
 })

 context('Is price below threshold', () => {
  it('Returns false if price is above threshold', async () => {
   //ARRANGE
   const price = 16

   //ACT
   const purchased = await Utilities.isPriceBelowThreshold(price)
   
   //ASSERT
   purchased.should.equal(false)
  })

  it('Returns true if price is below threshold', async () => {
   //ARRANGE
   const price = 9

   //ACT
   const purchased = await Utilities.isPriceBelowThreshold(price)

   //ASSERT
   purchased.should.equal(true)
  })
 })

 context('Update total monthly spend', () => {
  it('Updates total monthly spend', async () => {
   //ARRANGE
   const updatedTotalMonthlySpend = 10

   //ACT
   await Utilities.updateTotalMonthlySpend(updatedTotalMonthlySpend)
   const totalMonthlySpend = (await configBusiness.getConfigDetails())[0].totalMonthlySpend
   
   //ASSERT
   totalMonthlySpend.should.equal(10)
  })
 })
 
 beforeEach("Initialise Database", async function () {
  //Reset the database after each test
  await dbConfig.clearTestDb()
  await dbConfig.seedTestData()
 })
})