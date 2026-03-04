import deliveryOptions from '/cypress/fixtures/delivery/delivery_options.json'
import inventoryStatus from '/cypress/fixtures/inventory/inventory_status.json'

Cypress.Commands.add('mockProductCatalog', () => {
  const products = 'product/products.json'
  const categories = 'product/categories.json'

  cy.intercept('/api/v1/products/**', { fixture: products }).as('getProducts')
  cy.intercept('/api/v1/categories/**', { fixture: categories }).as('getCategories')
})

Cypress.Commands.add('mockCustomerAuth', () => {
  const customer = 'customer/customer_authenticated.json'

  cy.intercept('/api/v1/auth/*', { 
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' 
  }).as('authenticate')
  cy.intercept('/api/v1/customer/**', { fixture: customer }).as('getCustomer')
})

Cypress.Commands.add('mockCartEmpty', () => {
  const cart = 'customer/cart_empty.json'

  cy.intercept('/api/v1/cart/**', { fixture: cart }).as('getCart')
})

Cypress.Commands.add('mockCartWithItems', () => {
  const cart = 'customer/cart_with_items.json'
  const products = 'product/products.json'

  cy.intercept('/api/v1/cart/**', { fixture: cart }).as('getCart')
  cy.intercept('/api/v1/products/**', { fixture: products }).as('getProducts')
})

Cypress.Commands.add('mockDeliveryOptionsStandard', () => {
  cy.intercept('/api/v1/delivery/options/**', { fixture: deliveryOptions }).as('getDeliveryOptions')
})

Cypress.Commands.add('mockDeliveryOptionsExpress', () => {
  const expressOptions = 'delivery/express_delivery_options.json'
  cy.intercept('/api/v1/delivery/options/**', { fixture: expressOptions }).as('getDeliveryOptions')
})

Cypress.Commands.add('mockDeliveryOptionsPickup', () => {
  const pickupOptions = 'delivery/pickup_location_options.json'
  cy.intercept('/api/v1/delivery/options/**', { fixture: pickupOptions }).as('getDeliveryOptions')
  cy.intercept('/api/v1/stores/**', { fixture: 'delivery/store_locations.json' }).as('getStoreLocations')
})

Cypress.Commands.add('mockInventoryCheck', () => {
  cy.intercept('/api/v1/inventory/**', { fixture: inventoryStatus }).as('checkInventory')
})

Cypress.Commands.add('mockCheckoutFlow', () => {
  const cart = 'customer/cart_with_items.json'
  const payment = 'checkout/payment_methods.json'
  const delivery = 'delivery/delivery_schedule.json'

  cy.intercept('/api/v1/cart/**', { fixture: cart }).as('getCart')
  cy.intercept('/api/v1/payment/**', { fixture: payment }).as('getPaymentMethods')
  cy.intercept('/api/v1/delivery/schedule/**', { fixture: delivery }).as('scheduleDelivery')
})

Cypress.Commands.add('mockOrderConfirmation', () => {
  const order = 'order/order_confirmation.json'

  cy.intercept('/api/v1/orders/**', { fixture: order }).as('createOrder')
  cy.intercept('/api/v1/orders/*/confirmation/**', { fixture: order }).as('getOrderConfirmation')
})

Cypress.Commands.add('mockOrderHistory', () => {
  const orders = 'order/order_history.json'

  cy.intercept('/api/v1/orders/**', { fixture: orders }).as('getOrderHistory')
  cy.intercept('/api/v1/orders/*/status/**', { fixture: 'order/order_status.json' }).as('getOrderStatus')
})

Cypress.Commands.add('mockOrderTracking', () => {
  const tracking = 'order/order_tracking.json'

  cy.intercept('/api/v1/orders/*/tracking/**', { fixture: tracking }).as('getOrderTracking')
  cy.intercept('/api/v1/delivery/driver/**', { fixture: 'delivery/driver_location.json' }).as('getDriverLocation')
})

Cypress.Commands.add('mockInventoryThreshold', () => {
  const limitedInventory = 'inventory/limited_inventory.json'
  cy.intercept('/api/v1/inventory/**', { fixture: limitedInventory }).as('checkInventory')
})

Cypress.Commands.add('mockInventoryOutOfStock', () => {
  const outOfStock = 'inventory/out_of_stock.json'
  cy.intercept('/api/v1/inventory/**', { fixture: outOfStock }).as('checkInventory')
})

Cypress.Commands.add('mockPromotionalPricing', () => {
  const promotion = 'product/promotional_pricing.json'
  cy.intercept('/api/v1/products/**/pricing/**', { fixture: promotion }).as('getPromotionalPricing')
})

Cypress.Commands.add('mockGeoLocation', () => {
  cy.window().then((win) => {
    win.google = {
      maps: {
        Geocoder: class {
          geocode(request, callback) {
            callback([{ 
              geometry: { 
                location: { 
                  lat: () => 34.0522, 
                  lng: () => -118.2437 
                } 
              },
              formatted_address: 'Los Angeles, CA 90001'
            }], 'OK')
          }
        },
        LatLng: class {
          constructor(lat, lng) {
            this.lat = lat
            this.lng = lng
          }
        }
      }
    }
  })
})

Cypress.Commands.add('navigateToHome', () => {
  cy.visit('/')
  cy.get('[data-test="logo"]').should('be.visible')
})

Cypress.Commands.add('searchForProduct', (productName) => {
  cy.get('[data-test="search-input"]').type(productName)
  cy.get('[data-test="search-button"]').click()
  cy.wait('@getProducts')
})

Cypress.Commands.add('addProductToCart', (productName) => {
  cy.get(`[data-test="product-card-${productName}"]`)
    .should('be.visible')
    .find('[data-test="add-to-cart-button"]')
    .click()
  cy.wait('@getCart')
})

Cypress.Commands.add('updateProductQuantity', (productName, quantity) => {
  cy.get(`[data-test="cart-item-${productName}"]`)
    .find('[data-test="quantity-selector"]')
    .select(quantity)
})

Cypress.Commands.add('removeProductFromCart', (productName) => {
  cy.get(`[data-test="cart-item-${productName}"]`)
    .find('[data-test="remove-button"]')
    .click()
})

Cypress.Commands.add('proceedToCheckout', () => {
  cy.get('[data-test="checkout-button"]').click()
})

Cypress.Commands.add('selectDeliveryMethod', (methodType) => {
  cy.get(`[data-test="delivery-method-${methodType}"]`).click()
  cy.wait('@getDeliveryOptions')
})

Cypress.Commands.add('selectDeliverySlot', (day, timeSlot) => {
  cy.get(`[data-test="delivery-day-${day}"]`).click()
  cy.get(`[data-test="delivery-slot-${timeSlot}"]`).click()
})

Cypress.Commands.add('selectPickupLocation', (storeName) => {
  cy.get('[data-test="store-search-input"]').type(storeName)
  cy.wait('@getStoreLocations')
  cy.get(`[data-test="store-location-${storeName}"]`).click()
})

Cypress.Commands.add('selectPaymentMethod', (paymentType) => {
  cy.get(`[data-test="payment-method-${paymentType}"]`).click()
})

Cypress.Commands.add('enterPaymentDetails', (paymentDetails) => {
  if (paymentDetails.cardNumber) {
    cy.get('[data-test="card-number-input"]').type(paymentDetails.cardNumber)
  }
  if (paymentDetails.expiry) {
    cy.get('[data-test="card-expiry-input"]').type(paymentDetails.expiry)
  }
  if (paymentDetails.cvv) {
    cy.get('[data-test="card-cvv-input"]').type(paymentDetails.cvv)
  }
  if (paymentDetails.nameOnCard) {
    cy.get('[data-test="card-name-input"]').type(paymentDetails.nameOnCard)
  }
})

Cypress.Commands.add('applyPromoCode', (promoCode) => {
  cy.get('[data-test="promo-code-input"]').type(promoCode)
  cy.get('[data-test="apply-promo-button"]').click()
})

Cypress.Commands.add('placeOrder', () => {
  cy.get('[data-test="place-order-button"]').click()
  cy.wait('@createOrder')
})

Cypress.Commands.add('validateCartTotal', (expectedTotal) => {
  cy.get('[data-test="cart-total"]')
    .should('contain', expectedTotal)
})

Cypress.Commands.add('validateOrderConfirmation', (orderNumber) => {
  cy.get('[data-test="confirmation-heading"]')
    .should('contain', 'Order Confirmed')
  cy.get('[data-test="order-number"]')
    .should('contain', orderNumber)
})

Cypress.Commands.add('validateDeliveryEstimate', (estimatedDate) => {
  cy.get('[data-test="delivery-estimate"]')
    .should('contain', estimatedDate)
})

Cypress.Commands.add('validateOrderStatus', (status) => {
  cy.get('[data-test="order-status"]')
    .should('contain', status)
})

Cypress.Commands.add('validateTrackingInformation', (trackingInfo) => {
  cy.get('[data-test="tracking-number"]')
    .should('contain', trackingInfo.trackingNumber)
  cy.get('[data-test="estimated-delivery"]')
    .should('contain', trackingInfo.estimatedDelivery)
})

Cypress.Commands.add('validateOutOfStockMessage', (productName) => {
  cy.get(`[data-test="product-card-${productName}"]`)
    .should('contain', 'Out of Stock')
})

Cypress.Commands.add('validateLimitedAvailability', (productName) => {
  cy.get(`[data-test="product-card-${productName}"]`)
    .should('contain', 'Limited Availability')
})

Cypress.Commands.add('validatePromoDiscountApplied', (discountAmount) => {
  cy.get('[data-test="promo-discount"]')
    .should('contain', discountAmount)
})

Cypress.Commands.add('validateDeliveryFee', (fee) => {
  cy.get('[data-test="delivery-fee"]')
    .should('contain', fee)
})

Cypress.Commands.add('validateFreeDelivery', () => {
  cy.get('[data-test="delivery-fee"]')
    .should('contain', 'FREE')
})

Cypress.Commands.add('viewOrderDetails', (orderId) => {
  cy.get(`[data-test="order-card-${orderId}"]`)
    .find('[data-test="view-order-button"]')
    .click()
})

Cypress.Commands.add('cancelOrder', (orderId) => {
  cy.get(`[data-test="order-card-${orderId}"]`)
    .find('[data-test="cancel-order-button"]')
    .click()
  cy.get('[data-test="confirm-cancel-button"]').click()
})

Cypress.Commands.add('scheduleOrderForLater', (scheduledDate) => {
  cy.get('[data-test="schedule-later-checkbox"]').check()
  cy.get('[data-test="schedule-date-picker"]').type(scheduledDate)
})

Cypress.Commands.add('addItemToFavorites', (productName) => {
  cy.get(`[data-test="product-card-${productName}"]`)
    .find('[data-test="add-to-favorites-button"]')
    .click()
})

Cypress.Commands.add('validateFavoriteItemsCount', (count) => {
  cy.get('[data-test="favorites-count"]')
    .should('contain', count)
})

Cypress.Commands.add('viewSavedAddresses', () => {
  cy.get('[data-test="addresses-link"]').click()
})

Cypress.Commands.add('addNewAddress', (addressDetails) => {
  cy.get('[data-test="add-address-button"]').click()
  cy.get('[data-test="address-street-input"]').type(addressDetails.street)
  cy.get('[data-test="address-city-input"]').type(addressDetails.city)
  cy.get('[data-test="address-state-select"]').select(addressDetails.state)
  cy.get('[data-test="address-zip-input"]').type(addressDetails.zipCode)
  cy.get('[data-test="save-address-button"]').click()
})

Cypress.Commands.add('selectSavedAddress', (addressLabel) => {
  cy.get(`[data-test="saved-address-${addressLabel}"]`).click()
})

Cypress.Commands.add('validateMinimumOrderMet', () => {
  cy.get('[data-test="minimum-order-message"]').should('not.exist')
})

Cypress.Commands.add('validateMinimumOrderNotMet', (amount) => {
  cy.get('[data-test="minimum-order-message"]')
    .should('contain', `Minimum order amount: ${amount}`)
})
