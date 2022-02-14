/// <reference types="cypress" />

describe('Layoutit! Basic Page Render', () => {
  beforeEach(() => {
    cy.openApp()
  })

  describe('Sidebar: brand logo', () => {
    it('elements should be rendered', () => {
      cy.get('.sidebar .sidebar-logo').should('be.visible')
      cy.get('.sidebar [data-testid=brand-logo-image]').should('be.visible')
      cy.get('.sidebar [data-testid=brand-logo-svg]').should('be.visible')
      cy.get('.sidebar [data-testid=version-selector]').should('be.visible')
      cy.get('.sidebar [data-testid=version-selector]').should('have.length', 1)
    })
    it('should display v2 as default version', () => {
      cy.get('.sidebar [data-testid=version-selector] option').should('have.length', 2)
      cy.get('.sidebar [data-testid=version-selector]').should('have.value', 'v2')
    })
    it('be able to change the version to v1', () => {
      cy.get('.sidebar [data-testid=version-selector]').select('v1')
      cy.get('.sidebar [data-testid=version-selector]').should('have.length', 0)
      cy.get('h2').contains('Grid Columns') // is not there on v1
    })
  })
})
