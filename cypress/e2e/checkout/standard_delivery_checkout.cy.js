describe('Standard Delivery Checkout', () => {
  beforeEach(() => {
    cy.mockProductCatalog()
    cy.mockCustomerAuth()
    cy.mockCartWithItems()
    cy.mockDeliveryOptionsStandard()
    cy.mockCheckoutFlow()
    cy.mockGeoLocation()
    cy.navigateToHome()
  })

  it('allows customer to complete checkout with standard delivery', () => {
    cy.searchForProduct('Organic Milk')

    cy.get('[data-test="product-card-Organic Milk"]').should('be.visible')
    cy.addProductToCart('Organic Milk')

    cy.get('[data-test="cart-icon"]').should('contain', '1')
    cy.proceedToCheckout()

    cy.get('[data-test="checkout-heading"]').should('contain', 'Checkout')

    cy.selectDeliveryMethod('standard')
    cy.selectDeliverySlot('Tomorrow', '10:00 AM - 12:00 PM')

    cy.get('[data-test="delivery-summary"]').should('contain', 'Standard Delivery')
    cy.get('[data-test="delivery-time"]').should('contain', 'Tomorrow')

    cy.selectPaymentMethod('credit-card')
    cy.enterPaymentDetails({
      cardNumber: '4111111111111111',
      expiry: '12/25',
      cvv: '123',
      nameOnCard: 'John Doe'
    })

    cy.validateCartTotal('$12.99')
    cy.validateDeliveryFee('$4.99')
    cy.placeOrder()

    cy.validateOrderConfirmation('ORD-')
  })

  it('calculates delivery fee correctly based on order value', () => {
    cy.searchForProduct('Premium Coffee Beans')
    cy.addProductToCart('Premium Coffee Beans')

    cy.get('[data-test="cart-icon"]').click()
    cy.proceedToCheckout()

    cy.selectDeliveryMethod('standard')

    cy.get('[data-test="delivery-fee"]').should('contain', '$4.99')

    cy.addProductToCart('Organic Honey')
    cy.get('[data-test="cart-total"]').invoke('text').then((totalText) => {
      const total = parseFloat(totalText.replace('$', ''))
      if (total >= 50) {
        cy.validateFreeDelivery()
      }
    })
  })

  it('validates minimum order amount before checkout', () => {
    cy.searchForProduct('Bottled Water')
    cy.addProductToCart('Bottled Water')

    cy.get('[data-test="cart-icon"]').click()
    cy.proceedToCheckout()

    cy.validateMinimumOrderNotMet('$35.00')
    cy.get('[data-test="checkout-button"]').should('be.disabled')
  })
})
