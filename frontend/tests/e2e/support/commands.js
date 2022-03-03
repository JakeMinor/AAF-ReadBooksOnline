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

const employee = {
  id: "2",
  username: "Employee",
  email: "employee@test.com",
  roles: [
    {
      _id: "2",
      description: "The employee role for the system",
      id: "2",
      name: "Employee",
      permissions: []
    }
  ]
}

Cypress.Commands.add("clientLogin", () => {
  cy.server()

  cy.route('/user/sign-in', () => {
    cy.setCookie('access_token', `Bearer%20${jwt.sign(user, '123')}`)
  })
})

Cypress.Commands.add("employeeLogin", () => {
  cy.server()

  cy.route('/user/sign-in', () => {
    cy.setCookie('access_token', `Bearer%20${jwt.sign(employee, '123')}`)
  })
})
