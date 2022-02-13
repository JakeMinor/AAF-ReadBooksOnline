describe('Catalog', () => {
  beforeEach('Visit Catalog Page and Authenticate', () => {
    cy.clientLogin()

    cy.route('/bookRequest?limit=10&offset=0&status=Purchased', () => {
      return {
        requests: [{
          bookName: "BookName1",
          author: "Author1",
          bookType: "Book",
          isbn: "isbn1",
          requestedDateTime: new Date().toUTCString(),
          requestedBy: "1",
          status: "Purchased",
          price: 9
        },
        {
          bookName: "BookName2",
          author: "Author2",
          bookType: "Audiobook",
          isbn: "isbn2",
          requestedDateTime: new Date().toUTCString(),
          requestedBy: "1",
          status: "Purchased",
          price: 10
        }],
        count: 2
      }
    })

    cy.visit('/Catalog')
  })

  context('Route', () => {
    it("Should load catalog page", () => {
      //ARRANGE
      const expectedTitle = "Catalog"

      //ACT
      //ASSERT
      cy.get('.container h1').should('contain.text', expectedTitle)
    })
  })

  context('Table', () => {
    it("Should have headings of 'Book Name', 'Author', 'Isbn', 'Book Type' and 'Price'", () => {
      //ARRANGE
      const bookNameTitle = 'Book Name'
      const authorTitle = 'Author'
      const isbnTitle = 'Isbn'
      const bookTypeTitle = 'Book Type'
      const priceTitle = 'Price'

      //ACT
      //ASSERT
      cy.get('thead th').eq(0).should('contain.text', bookNameTitle)
      cy.get('thead th').eq(1).should('contain.text', authorTitle)
      cy.get('thead th').eq(2).should('contain.text', isbnTitle)
      cy.get('thead th').eq(3).should('contain.text', bookTypeTitle)
      cy.get('thead th').eq(4).should('contain.text', priceTitle)
    })

    it('Should populate table with two fields', () => {
      //ARRANGE
      const expectedRowOneBookName = "BookName1"
      const expectedRowOneAuthor = "Author1"
      const expectedRowOneIsbn = "isbn1"
      const expectedRowOneBookType = 'Book'
      const expectedRowOnePrice = "£9.00"
      const expectedRowTwoBookName = "BookName2"
      const expectedRowTwoAuthor = "Author2"
      const expectedRowTwoIsbn = "isbn2"
      const expectedRowTwoBookType = 'Audiobook'
      const expectedRowTwoPrice = "£10.00"

      //ACT
      cy.wait(500)

      //ASSERT
      cy.get('td').eq(0).should('contain.text', expectedRowOneBookName)
      cy.get('td').eq(1).should('contain.text', expectedRowOneAuthor)
      cy.get('td').eq(2).should('contain.text', expectedRowOneIsbn)
      cy.get('td').eq(3).should('contain.text', expectedRowOneBookType)
      cy.get('td').eq(4).should('contain.text', expectedRowOnePrice)

      cy.get('td').eq(5).should('contain.text', expectedRowTwoBookName)
      cy.get('td').eq(6).should('contain.text', expectedRowTwoAuthor)
      cy.get('td').eq(7).should('contain.text', expectedRowTwoIsbn)
      cy.get('td').eq(8).should('contain.text', expectedRowTwoBookType)
      cy.get('td').eq(9).should('contain.text', expectedRowTwoPrice)

      cy.get('#Pagination-Details').should('contain.text', "2 books in 1 page")
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
  })
})
