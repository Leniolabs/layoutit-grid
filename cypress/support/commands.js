// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
const local = 'http://localhost:3000'
Cypress.Commands.add('openApp', () => {
  cy.visit(local)
})
