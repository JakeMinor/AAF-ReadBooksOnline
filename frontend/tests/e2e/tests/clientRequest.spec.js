describe('Client Request', () => {
  beforeEach('Authenticate and visit request page', () => {
    cy.clientLogin()

    cy.route('/bookRequest?requestedBy=1&limit=10&offset=0', () => {
      return {
        requests: [{
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
            bookName: "BookName2",
            author: "Author2",
            bookType: "Audiobook",
            isbn: "isbn2",
            requestedDateTime: new Date().toUTCString(),
            requestedBy: "1",
            status: "In Review"
          },
          {
            bookName: "BookName3",
            author: "Author3",
            bookType: "Book",
            isbn: "isbn3",
            requestedDateTime: new Date().toUTCString(),
            requestedBy: "1",
            status: "Additional Information Required"
          },
          {
            bookName: "BookName4",
            author: "Author4",
            bookType: "Audiobook",
            isbn: "isbn4",
            requestedDateTime: new Date().toUTCString(),
            requestedBy: "1",
            status: "Awaiting Approval"
          },
          {
            bookName: "BookName5",
            author: "Author5",
            bookType: "Book",
            isbn: "isbn5",
            requestedDateTime: new Date().toUTCString(),
            requestedBy: "1",
            status: "Purchased"
          },
          {
            bookName: "BookName6",
            author: "Author6",
            bookType: "Audiobook",
            isbn: "isbn6",
            requestedDateTime: new Date().toUTCString(),
            requestedBy: "1",
            status: "Denied"
          }],
        count: 6
      }
    })

    cy.visit('/client-requests')

    cy.wait(500)
  })

  context('Route', () => {
    it("Should load My Requests page", () => {
      //ARRANGE
      const expectedTitle = "My Requests"

      //ACT
      //ASSERT
      cy.get('.container h1').should('contain.text', expectedTitle)
    })
  })

  context('Table', () => {
    it("Should have headings of 'Book Name', 'Author', 'Isbn', 'Book Type', 'Requested Date Time' and 'Status'", () => {
      //ARRANGE
      const bookNameTitle = 'Book Name'
      const authorTitle = 'Author'
      const isbnTitle = 'Isbn'
      const bookTypeTitle = 'Book Type'
      const requestedDateTimeTitle = 'Requested Date Time'
      const statusTitle = 'Status'
      const actionTitle = 'Actions'

      //ACT
      //ASSERT
      cy.get('thead th').eq(0).should('contain.text', bookNameTitle)
      cy.get('thead th').eq(1).should('contain.text', authorTitle)
      cy.get('thead th').eq(2).should('contain.text', isbnTitle)
      cy.get('thead th').eq(3).should('contain.text', bookTypeTitle)
      cy.get('thead th').eq(4).should('contain.text', requestedDateTimeTitle)
      cy.get('thead th').eq(5).should('contain.text', statusTitle)
      cy.get('thead th').eq(6).should('contain.text', actionTitle)

      cy.get('#Pagination-Details').should('contain.text', "6 requests in 1 pages")
    })

    it("Should populate table with 6 fields", () => {
      //ARRANGE
      const expectedBookItems = 6

      //ACT
      //ASSERT
      cy.get('tbody tr').should('have.length', expectedBookItems)
    })

    it('Should show 5 books when per page is set to 5', () => {
      //ARRANGE
      const perPage = '5'
      cy.route('/bookRequest?requestedBy=1&limit=5&offset=0', () => {
        return {
          requests: [{
            bookName: "BookName1",
            author: "Author1",
            bookType: "Book",
            isbn: "isbn1",
            requestedDateTime: new Date().toUTCString(),
            requestedBy: "1",
            status: "Pending Review"
          },
            {
              bookName: "BookName2",
              author: "Author2",
              bookType: "Audiobook",
              isbn: "isbn2",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "In Review"
            },
            {
              bookName: "BookName3",
              author: "Author3",
              bookType: "Book",
              isbn: "isbn3",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Additional Information Required"
            },
            {
              bookName: "BookName4",
              author: "Author4",
              bookType: "Audiobook",
              isbn: "isbn4",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Awaiting Approval"
            },
            {
              bookName: "BookName5",
              author: "Author5",
              bookType: "Book",
              isbn: "isbn5",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Purchased"
            }],
          count: 6
        }
      })

      //ACT
      cy.get('#Pagination-Per-Page').select(perPage)

      //ASSERT
      cy.get('tbody tr').should('have.length', perPage)
    })

    it('Should show 1 book when page number is set to 2', () => {
      //ARRANGE
      const expectedBookItems = 1
      const perPage = '5'
      cy.route('/bookRequest?requestedBy=1&limit=5&offset=1', () => {
        return {
          requests: [
            {
              bookName: "BookName6",
              author: "Author6",
              bookType: "Audiobook",
              isbn: "isbn6",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Denied"
            }],
          count: 6
        }
      })
      cy.route('/bookRequest?requestedBy=1&limit=5&offset=0', () => {
        return {
          requests: [{
            bookName: "BookName1",
            author: "Author1",
            bookType: "Book",
            isbn: "isbn1",
            requestedDateTime: new Date().toUTCString(),
            requestedBy: "1",
            status: "Pending Review"
          },
            {
              bookName: "BookName2",
              author: "Author2",
              bookType: "Audiobook",
              isbn: "isbn2",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "In Review"
            },
            {
              bookName: "BookName3",
              author: "Author3",
              bookType: "Book",
              isbn: "isbn3",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Additional Information Required"
            },
            {
              bookName: "BookName4",
              author: "Author4",
              bookType: "Audiobook",
              isbn: "isbn4",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Awaiting Approval"
            },
            {
              bookName: "BookName5",
              author: "Author5",
              bookType: "Book",
              isbn: "isbn5",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Purchased"
            }],
          count: 6
        }
      })

      //ACT
      cy.get('#Pagination-Per-Page').select(perPage)
      cy.get('#Pagination-Bar li').eq(4).click()

      //ASSERT
      cy.get('tbody tr').should('have.length', expectedBookItems)
    })

    it('Should filter by Book Name', () => {
      //ARRANGE
      const expectedBookName = "BookName1"

      //ACT
      cy.get('#Book-Name-Filter').type(expectedBookName)

      //ASSERT
      cy.get('td').eq(0).should('contain.text', expectedBookName)
    })

    it('Should filter by Author', () => {
      //ARRANGE
      const expectedAuthor = "Author1"

      //ACT
      cy.get('#Author-Filter').type(expectedAuthor)

      //ASSERT
      cy.get('td').eq(1).should('contain.text', expectedAuthor)
    })

    it('Should filter by ISBN', () => {
      //ARRANGE
      const expectedISBN = "isbn1"

      //ACT
      cy.get('#ISBN-Filter').type(expectedISBN)

      //ASSERT
      cy.get('td').eq(2).should('contain.text', expectedISBN)
    })

    it('Should filter by Book Type', () => {
      //ARRANGE
      const expectedBookType = "Book"

      //ACT
      cy.get('#Book-Type-Filter').select(expectedBookType)

      //ASSERT
      cy.get('td').eq(3).should('contain.text', expectedBookType)
    })

    it('Should filter by Status', () => {
      //ARRANGE
      const expectedStatus = "Pending Review"

      //ACT
      cy.get('#Status-Filter').select(expectedStatus)

      //ASSERT
      cy.get('td').eq(5).should('contain.text', expectedStatus)
    })
  })

  context('Create Request', () => {
    it('Can type in Book Name', () => {
      //ARRANGE
      cy.get('#Create-Request').click()
      const bookName = "NewBookName"

      //ACT
      cy.get('#Book-Name-Input').type(bookName)

      //ASSERT
      cy.get('#Book-Name-Input input').should('have.value', bookName)
    })

    it('Can type in Author', () => {
      //ARRANGE
      cy.get('#Create-Request').click()
      const authorName = "Author"

      //ACT
      cy.get('#Author-Input').type(authorName)

      //ASSERT
      cy.get('#Author-Input input').should('have.value', authorName)
    })

    it('Can select Book Type', () => {
      //ARRANGE
      cy.get('#Create-Request').click()
      const bookType = "Book"

      //ACT
      cy.get('#Book-Type-Input select').select(bookType)

      //ASSERT
      cy.get('#Book-Type-Input select').should('have.value', bookType)
    })

    it('Can type in ISBN', () => {
      //ARRANGE
      cy.get('#Create-Request').click()
      const isbn = "ISBN"

      //ACT
      cy.get('#ISBN-Input').type(isbn)

      //ASSERT
      cy.get('#ISBN-Input input').should('have.value', isbn)
    })

    it('Can trigger validation', () => {
      //ARRANGE
      cy.get('#Create-Request').click()
      const bookNameError = "Book Name is required."
      const authorError = "Author is required."
      const bookTypeError = "Book Type is required."

      //ACT
      cy.get('#Create').click()

      //ASSERT
      cy.get('#Book-Name-Input #Error').should('contain.text', bookNameError)
      cy.get('#Author-Input #Error').should('contain.text', authorError)
      cy.get('#Book-Type-Input #Error').should('contain.text', bookTypeError)
    })
  })

  context('Edit Request', () => {
    it('Should not be editable if the status isnt Pending Review or Additional Information Required', () => {
      //ARRANGE
      const status = "In Review"

      //ACT
      cy.get('#Status-Filter').select(status)

      //ASSERT
      cy.get('td').eq(6).should('not.contain.text', 'Edit')
    })

    it('Can type in Book Name', () => {
      //ARRANGE
      const bookName = "NewBookName"

      //ACT
      cy.get('#Edit-Request').click().click()
      cy.get('#Book-Name-Input input').clear().type(bookName)
      //ASSERT
      cy.get('#Book-Name-Input input').should('have.value', bookName)
    })

    it('Can type in Author', () => {
      //ARRANGE
      cy.get('#Edit-Request').click().click()
      const authorName = "Author"

      //ACT
      cy.get('#Author-Input input').clear().type(authorName)

      //ASSERT
      cy.get('#Author-Input input').should('have.value', authorName)
    })

    it('Can select Book Type', () => {
      //ARRANGE
      cy.get('#Edit-Request').click().click()
      const bookType = "Book"

      //ACT
      cy.get('#Book-Type-Input select').select(bookType)

      //ASSERT
      cy.get('#Book-Type-Input select').should('have.value', bookType)
    })

    it('Can type in ISBN', () => {
      //ARRANGE
      cy.get('#Edit-Request').click().click()
      const isbn = "ISBN"

      //ACT
      cy.get('#ISBN-Input input').clear().type(isbn)

      //ASSERT
      cy.get('#ISBN-Input input').should('have.value', isbn)
    })
  })

  context('Delete Request', () => {
    it('Can delete request', () => {
      //ARRANGE
      cy.route('DELETE', '/bookRequest/1', () => {return{}}).as('delete')
      cy.route('/bookRequest?requestedBy=1&limit=10&offset=0', () => {
        return {
          requests: [
            {
              bookName: "BookName2",
              author: "Author2",
              bookType: "Audiobook",
              isbn: "isbn2",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "In Review"
            },
            {
              bookName: "BookName3",
              author: "Author3",
              bookType: "Book",
              isbn: "isbn3",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Additional Information Required"
            },
            {
              bookName: "BookName4",
              author: "Author4",
              bookType: "Audiobook",
              isbn: "isbn4",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Awaiting Approval"
            },
            {
              bookName: "BookName5",
              author: "Author5",
              bookType: "Book",
              isbn: "isbn5",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Purchased"
            },
            {
              bookName: "BookName6",
              author: "Author6",
              bookType: "Audiobook",
              isbn: "isbn6",
              requestedDateTime: new Date().toUTCString(),
              requestedBy: "1",
              status: "Denied"
            }],
          count: 5
        }
      })
      const expectedBookItems = 5

      //ACT
      cy.get('#Delete-Request').click().then(() => {
        cy.wait('@delete')
      })
      //ASSERT
      cy.get('tbody tr').should('have.length', expectedBookItems)
    })

    it('Should only be deletable if the status is pending review', () => {
      //ARRANGE
      const pendingReviewStatus = "Pending Review"
      const inReviewStatus = "In Review"

      //ACT
      //ASSERT
      cy.get('#Status-Filter').select(pendingReviewStatus)
      cy.get('td').eq(6).should('contain.text', 'Delete')

      cy.get('#Status-Filter').select(inReviewStatus)
      cy.get('td').eq(6).should('not.contain.text', 'Delete')
    })
  })

  context('Status History', () => {
    it('Can show status history', () => {
      //ARRANGE
      //ACT
      cy.get('#Status-History').click()

      //ASSERT
      cy.get('.card-body h5').should('have.text', 'Status Timeline')
    })

    it('Can type additional information', () => {
      //ARRANGE
      const additionalInformationStatus = "Additional Information Required"
      const additionalInformationMessage = "Here is some additional information"

      //ACT
      cy.get('#Status-Filter').select(additionalInformationStatus)
      cy.get('#Status-History').click()
      cy.get('#Additional-Information input').type(additionalInformationMessage)

      //ASSERT
      cy.get('#Additional-Information input').should('have.value', additionalInformationMessage)
    })
  })

  context('Support Chat', () => {
    it('Can type in support message', () => {
      //ARRANGE
      const supportMessage = "Hello I need help"

      //ACT
      cy.get('#Support-Chat').click().click()
      cy.get('#Message').type(supportMessage)

      //ASSERT
      cy.get('#Message').should('have.value', supportMessage)
    })
  })
})
