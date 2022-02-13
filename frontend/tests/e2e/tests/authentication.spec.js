const jwt = require("jsonwebtoken")
const user = {
  id: "1",
  username: "Client",
  email: "client@test.com",
  roles: [
    {
      _id: "1",
      description: "The base role for the system",
      id: "1",
      name: "Client",
      permissions: [
        {
          _id: "1",
          name: "ReadRequest"
        },
        {
          _id: "2",
          name: "CreateRequest"
        },
        {
          _id: "3",
          name: "UpdateRequest"
        },
        {
          _id: "4",
          name: "DeleteRequest"
        }
      ]
    }
  ]
}

describe('Authentication', () => {
  context('Sign In Screen', () => {
    beforeEach('Visit Sign Up Screen', () => {
      cy.visit('/sign-in')
    })

    it('Can type in email', () => {
      //ARRANGE
      const email = "email@email.com"

      //ACT
      cy.get('*[class^="card-body"]').find('#Email').type(email)

      //ASSERT
      cy.get('*[class^="card-body"]').find('#Email input').should('have.value', email)
    })

    it('Can type in password', () => {
      //ARRANGE
      const password = "password"

      //ACT
      cy.get('*[class^="card-body"]').find('#Password').type(password)

      //ASSERT
      cy.get('*[class^="card-body"]').find('#Password input').should('have.value', password)
    })

    it('Can click Sign Up and be taken to Sign Up screen', () => {
      //ARRANGE
      const expectedTitle = "Sign up to ReadBooks Online"

      //ACT
      cy.get('*[class^="card-body"]').find('#SignUp').click()

      //ASSERT
      cy.get('*[class^="card-body"]').find('h4').should('contain.text', expectedTitle)
    })

    it('Can click Sign In and client be logged in', () => {
      //ARRANGE
      const password = "password"
      const email = "email@email.com"
      const username = "Client"

      //ACT
      cy.server()
      cy.get('*[class^="card-body"]').find('#Email').type(email)
      cy.get('*[class^="card-body"]').find('#Password').type(password)

      cy.get('*[class^="card-body"]').find('#SignIn').click().then(() => {
        cy.route('/user/sign-in', () => {
          cy.setCookie('access_token', `Bearer%20${jwt.sign(user, '123')}`)
        })

        cy.visit('/catalog')
      })

      //ASSERT
      cy.getCookie('access_token').its('name').should('eq', 'access_token')
      cy.get('#Username__BV_toggle_').should('contain.text', username)
    })
  })

  context('Sign Up Screen', () => {
    beforeEach('Visit Sign Up Screen', () => {
      cy.visit('/sign-up')
    })

    it('Can type in email', () => {
      //ARRANGE
      const email = "email@email.com"

      //ACT
      cy.get('*[class^="card-body"]').find('#Email').type(email)

      //ASSERT
      cy.get('*[class^="card-body"]').find('#Email input').should('have.value', email)
    })

    it('Can type in username', () => {
      //ARRANGE
      const username = "username"

      //ACT
      cy.get('*[class^="card-body"]').find('#Username').type(username)

      //ASSERT
      cy.get('*[class^="card-body"]').find('#Username input').should('have.value', username)
    })

    it('Can type in password', () => {
      //ARRANGE
      const password = "password"

      //ACT
      cy.get('*[class^="card-body"]').find('#Password').type(password)

      //ASSERT
      cy.get('*[class^="card-body"]').find('#Password input').should('have.value', password)
    })

    it('Can click Sign In and be taken to Sign In screen', () => {
      //ARRANGE
      const expectedTitle = "Sign in to ReadBooks Online"

      //ACT
      cy.get('*[class^="card-body"]').find('#SignIn').click()

      //ASSERT
      cy.get('*[class^="card-body"]').find('h4').should('contain.text', expectedTitle)
    })
  })
})
