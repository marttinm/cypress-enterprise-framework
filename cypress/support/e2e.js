import './commands'

before(() => {
  if (Cypress.env('APP_MAINTENANCE_MODE') === 'true') {
    cy.log('Maintenance mode is enabled, skipping all tests.')
    Cypress.env('maintenance_mode', true)
  }
})

beforeEach(() => {
  if (Cypress.env('maintenance_mode') === true) {
    cy.log('Skipping test due to maintenance mode being active.')
    Cypress.runner.stop()
  }
})

Cypress.on('uncaught:exception', (_err, _runnable) => {
  return false
})
