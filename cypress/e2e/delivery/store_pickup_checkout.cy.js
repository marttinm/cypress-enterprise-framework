describe('Store Pickup Checkout', () => {
  beforeEach(() => {
    cy.mockProductCatalog()
    cy.mockCustomerAuth()
    cy.mockCartWithItems()
    cy.mockDeliveryOptionsPickup()
    cy.mockCheckoutFlow()
    cy.mockGeoLocation()
    cy.navigateToHome()
  })

  it('allows customer to select store pickup as delivery method', () => {
    cy.searchForProduct('Fresh Bakery Items')
    cy.addProductToCart('Fresh Bakery Items')

    cy.get('[data-test="cart-icon"]').click()
    cy.proceedToCheckout()

    cy.selectDeliveryMethod('pickup')

    cy.get('[data-test="store-locator"]').should('be.visible')
    cy.selectPickupLocation('Downtown Market')

    cy.get('[data-test="pickup-location"]').should('contain', 'Downtown Market')
    cy.get('[data-test="pickup-hours"]').should('contain', 'Open until 9:00 PM')

    cy.selectPaymentMethod('credit-card')
    cy.enterPaymentDetails({
      cardNumber: '4111111111111111',
      expiry: '12/25',
      cvv: '123',
      nameOnCard: 'Alex Johnson'
    })

    cy.validateDeliveryFee('$0.00')
    cy.placeOrder()

    cy.validateOrderConfirmation('ORD-')
    cy.get('[data-test="pickup-instructions"]')
      .should('contain', 'Bring your order number to the pickup counter')
  })

  it('displays available pickup time slots', () => {
    cy.searchForProduct('Frozen Groceries')
    cy.addProductToCart('Frozen Groceries')

    cy.get('[data-test="cart-icon"]').click()
    cy.proceedToCheckout()

    cy.selectDeliveryMethod('pickup')
    cy.selectPickupLocation('Westside Store')

    cy.get('[data-test="pickup-slots"]').should('be.visible')
    cy.get('[data-test="slot-same-day"]').should('exist')
    cy.get('[data-test="slot-next-day"]').should('exist')
  })

  it('allows customer to change pickup location before confirmation', () => {
    cy.searchForProduct('Dairy Products')
    cy.addProductToCart('Dairy Products')

    cy.get('[data-test="cart-icon"]').click()
    cy.proceedToCheckout()

    cy.selectDeliveryMethod('pickup')
    cy.selectPickupLocation('Eastgate Market')

    cy.get('[data-test="pickup-location"]').should('contain', 'Eastgate Market')

    cy.get('[data-test="change-pickup-location"]').click()
    cy.selectPickupLocation('Northpoint Store')

    cy.get('[data-test="pickup-location"]').should('contain', 'Northpoint Store')
  })
})
