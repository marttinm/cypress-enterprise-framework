describe('Order History and Tracking', () => {
  beforeEach(() => {
    cy.mockCustomerAuth()
    cy.mockOrderHistory()
    cy.navigateToHome()
  })

  it('displays order history for authenticated customer', () => {
    cy.get('[data-test="account-menu"]').click()
    cy.get('[data-test="orders-link"]').click()

    cy.get('[data-test="order-history-heading"]').should('contain', 'Your Orders')
    cy.get('[data-test="order-card-ORD-12345"]').should('be.visible')
    cy.get('[data-test="order-card-ORD-12346"]').should('be.visible')
    cy.get('[data-test="order-card-ORD-12347"]').should('be.visible')
  })

  it('allows customer to track active order', () => {
    cy.mockOrderTracking()

    cy.get('[data-test="account-menu"]').click()
    cy.get('[data-test="orders-link"]').click()

    cy.viewOrderDetails('ORD-12345')

    cy.get('[data-test="order-detail-heading"]').should('contain', 'Order #ORD-12345')

    cy.get('[data-test="track-order-button"]').click()

    cy.validateTrackingInformation({
      trackingNumber: 'TRK-987654321',
      estimatedDelivery: 'Tomorrow by 6:00 PM'
    })

    cy.get('[data-test="delivery-progress"]').should('exist')
    cy.get('[data-test="driver-location"]').should('exist')
  })

  it('displays order status correctly', () => {
    cy.get('[data-test="account-menu"]').click()
    cy.get('[data-test="orders-link"]').click()

    cy.get('[data-test="order-card-ORD-12345"]')
      .should('contain', 'Out for Delivery')

    cy.get('[data-test="order-card-ORD-12346"]')
      .should('contain', 'Delivered')

    cy.get('[data-test="order-card-ORD-12347"]')
      .should('contain', 'Processing')
  })

  it('allows customer to cancel eligible order', () => {
    cy.get('[data-test="account-menu"]').click()
    cy.get('[data-test="orders-link"]').click()

    cy.viewOrderDetails('ORD-12347')

    cy.get('[data-test="cancel-order-button"]').should('be.visible')
    cy.cancelOrder('ORD-12347')

    cy.get('[data-test="cancellation-confirmation"]')
      .should('contain', 'Order has been cancelled')
  })

  it('displays past order details correctly', () => {
    cy.get('[data-test="account-menu"]').click()
    cy.get('[data-test="orders-link"]').click()

    cy.viewOrderDetails('ORD-12346')

    cy.get('[data-test="order-items"]').should('contain', 'Organic Milk')
    cy.get('[data-test="order-items"]').should('contain', 'Fresh Bread')
    cy.get('[data-test="order-total"]').should('contain', '$45.97')
    cy.get('[data-test="delivery-address"]').should('contain', '123 Main St')
  })
})
