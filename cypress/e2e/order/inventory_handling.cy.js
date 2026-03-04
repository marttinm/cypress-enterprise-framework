describe('Product Inventory Management', () => {
  beforeEach(() => {
    cy.mockProductCatalog()
    cy.mockCustomerAuth()
    cy.mockCartEmpty()
    cy.navigateToHome()
  })

  it('displays out of stock products correctly', () => {
    cy.mockInventoryOutOfStock()

    cy.searchForProduct('Seasonal Item')

    cy.validateOutOfStockMessage('Seasonal Item')
    cy.get('[data-test="product-card-Seasonal Item"]')
      .find('[data-test="add-to-cart-button"]')
      .should('be.disabled')
  })

  it('shows limited availability warning for low stock items', () => {
    cy.mockInventoryThreshold()

    cy.searchForProduct('Holiday Special Pack')

    cy.validateLimitedAvailability('Holiday Special Pack')
    cy.get('[data-test="product-card-Holiday Special Pack"]')
      .should('contain', 'Only 3 left')
  })

  it('updates cart when product becomes unavailable', () => {
    cy.mockInventoryOutOfStock()
    cy.mockCartWithItems()

    cy.get('[data-test="cart-icon"]').click()

    cy.get('[data-test="cart-item-Organic Milk"]').should('be.visible')

    cy.get('[data-test="refresh-inventory-button"]').click()

    cy.get('[data-test="unavailable-item-notification"]')
      .should('contain', 'Organic Milk is no longer available')
  })

  it('allows adding products with sufficient inventory', () => {
    cy.mockInventoryCheck()

    cy.searchForProduct('Organic Milk')
    cy.addProductToCart('Organic Milk')

    cy.get('[data-test="cart-notification"]')
      .should('contain', 'Added to cart')
  })

  it('validates quantity against available inventory', () => {
    cy.mockInventoryThreshold()

    cy.searchForProduct('Holiday Special Pack')
    cy.addProductToCart('Holiday Special Pack')

    cy.get('[data-test="cart-icon"]').click()

    cy.get('[data-test="cart-item-Holiday Special Pack"]')
      .find('[data-test="quantity-selector"]')
      .select('5')

    cy.get('[data-test="inventory-warning"]')
      .should('contain', 'Only 3 available')
  })
})
