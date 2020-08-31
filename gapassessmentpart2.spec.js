describe('GAP Assessment - Part 2', () => {

    var user = 'shopmanager'
    var password = 'axY2 rimc SzO9 cobf AZBw NLnX'
    var ipaddress = '34.205.174.166'
    var product = {
        name: "Fabian",
        type: "simple",
        regular_price: "99.99",
        description: "GAP Test - Description.",
        short_description: "GAP Test - Short description.",
    }
    var quantity = '7'
    var prodid

    Cypress.config('baseUrl', 'http://' + user + ':' + password + '@' + ipaddress)

    it('Prerequisite - POST: Create a product', () => {
        cy.request('POST', '/wp-json/wc/v3/products', product).then((response) => {
            expect(response.status).equal(201) //Assert POST response status is equal to 201.
            expect(response.body.name).equal(product.name) //Assert POST response product name is correct.
            prodid = response.body.id
        })
    })
    
    it('UI Steps', () => {
        cy.visit('/product/' + product.name + '/') // Visit the product page and assert (by default) that page loads correctly.
        cy.get('.product_title').should('be.visible') // Assert that the product title is displayed.
        cy.get('.woocommerce-Price-amount').should('be.visible') // Assert that the product pricing is displayed.
        cy.get('input[name="quantity"]').clear().type(quantity).should('have.value', quantity) // Clear and enter quantity amount in the Quantity field. Assert that the Quantity field has a value equal to quantity amount.
        cy.get('button[name="add-to-cart"]').click() // Click on the Add To Cart button.
        cy.get('a.cart-contents > span.count').should('have.text', quantity + ' items') // Assert that count of Cart icon gets updated with correct quantity of items.
        cy.get('.cart-contents[title="View your shopping cart"]').click() // Click on the Cart icon.
        cy.url().should('eq', 'http://' + ipaddress + '/cart/') // Assert that the user navigates to correct cart url.
        cy.get('tr.woocommerce-cart-form__cart-item > td.product-name > a').should('have.text', product.name) // Assert that product shows in the cart.
        cy.get('tr.woocommerce-cart-form__cart-item > td.product-price > span.woocommerce-Price-amount').should('have.text', '$' + product.regular_price) // Assert that product price in the cart is correct.
        cy.get('tr.woocommerce-cart-form__cart-item > td.product-quantity > div > input.input-text').should('have.value', quantity) // Assert that product quantity in the cart is correct.
    })


    it('Cleanup - DELETE: Delete the created product', () => {
        cy.request('DELETE', '/wp-json/wc/v3/products/' + prodid).then((response) => {
              expect(response.status).equal(200) //Assert POST response status is equal to 200.
              expect(response.body.name).equal(product.name) //Assert POST response product name is correct.
        })
    })

})