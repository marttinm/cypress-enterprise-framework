describe('Express Delivery Checkout', () => {
  beforeEach(() => {
    cy.mockProductCatalog()
    cy.mockCustomerAuth()
    cy.mockCartWithItems()
    cy.mockDeliveryOptionsExpress()
    cy.mockCheckoutFlow()
    cy.mockGeoLocation()
    cy.navigateToHome()
  })

  it('allows customer to select express delivery for fast shipping', () => {
    cy.searchForProduct('Fresh Produce Box')
    cy.addProductToCart('Fresh Produce Box')

    cy.get('[data-test="cart-icon"]').click()
    cy.proceedToCheckout()

    cy.selectDeliveryMethod('express')

    cy.get('[data-test="express-delivery-options"]').should('be.visible')
    cy.selectDeliverySlot('Today', '2:00 PM - 4:00 PM')

    cy.get('[data-test="delivery-summary"]').should('contain', 'Express Delivery')
    cy.get('[data-test="delivery-time"]').should('contain', 'Today')

    cy.validateDeliveryFee('$9.99')

    cy.selectPaymentMethod('credit-card')
    cy.enterPaymentDetails({
      cardNumber: '5555555555554444',
      expiry: '06/26',
      cvv: '456',
      nameOnCard: 'Jane Smith'
    })

    cy.placeOrder()

    cy.validateOrderConfirmation('ORD-')
    cy.validateDeliveryEstimate('Today')
  })

  it('offers express delivery only within eligible radius', () => {
    cy.searchForProduct('Organic Vegetables')
    cy.addProductToCart('Organic Vegetables')

    cy.get('[data-test="cart-icon"]').click()
    cy.proceedToCheckout()

    cy.selectDeliveryMethod('express')

    cy.get('[data-test="delivery-eligibility-message"]')
      .should('contain', 'Express delivery available in your area')
  })

  it('applies promotional discount to express delivery', () => {
    cy.mockPromotionalPricing()

    cy.searchForProduct('Gourmet Cheese Selection')
    cy.addProductToCart('Gourmet Cheese Selection')

    cy.get('[data-test="cart-icon"]').click()
    cy.proceedToCheckout()

    cy.selectDeliveryMethod('express')
    cy.selectDeliverySlot('Today', '4:00 PM - 6:00 PM')

    cy.applyPromoCode('EXPRESS20')

    cy.validatePromoDiscountApplied('$20.00')
    cy.validateDeliveryFee('$0.00')
  })
})
