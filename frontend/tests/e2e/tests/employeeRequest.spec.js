describe('Employee Requests', () => {
  beforeEach('Authenticate and visit employee request page', () => {
    cy.employeeLogin()

    cy.route('/bookRequest?status=Pending+Review&limit=10&offset=0', () => {
      return {
        requests: [
          {
            _id: "1",
            bookName: "BookName1",
            author: "Author1",
            bookType: "Book",
            isbn: "isbn1",
            requestedDateTime: new Date().toUTCString(),
            requestedBy: "1",
            status: "Pending Review"
          },
          {
            _id: "3",
            bookName: "BookName3",
            author: "Author3",
            bookType: "Book",
            isbn: "isbn3",
            requestedDateTime: new Date().toUTCString(),
            requestedBy: "1",
            status: "Pending Review"
          },
        ]
      }
    })

    cy.route('/bookRequest?assignedTo=2&status=In+Review&limit=10&offset=0', () => {
      return {
        requests: [
          {
            _id: "2",
            bookName: "BookName2",
            author: "Author2",
            bookType: "Book",
            isbn: "isbn2",
            requestedDateTime: new Date().toUTCString(),
            requestedBy: "1",
            status: "In Review"
          }
        ]
      }
    })

    cy.visit('/employee-requests')
  })

  context('Route', () => {
    it("Should load Employee Requests page", () => {
      //ARRANGE
      const expectedTitle = "Unallocated Requests"

      //ACT
      //ASSERT
      cy.get('.container h1').should('contain.text', expectedTitle)
    })
  })
})
