describe('CityHistoryWalks admin tours CRUD', () => {
  const email = Cypress.env('ADMIN_EMAIL');
  const password = Cypress.env('ADMIN_PASSWORD');

  const shouldRun = Boolean(email && password);

  (shouldRun ? it : it.skip)('allows navigating to admin tours and selecting a tour', () => {
    // Login
    cy.visit('/admin/login');
    cy.get('input[formcontrolname="email"]').clear({ force: true }).type(email as string, {
      force: true
    });
    cy
      .get('input[formcontrolname="password"]')
      .clear({ force: true })
      .type(password as string, { log: false, force: true });
    cy.contains('button', 'Sign in').click({ force: true });
    cy.url().should('include', '/admin/dashboard');

    // Use dashboard button to open tours manager
    cy.contains('Open tours manager').click();
    cy.url().should('include', '/admin/tours');

    // Ensure at least one tour is present and selectable
    cy.get('.vh-admin-tours button')
      .first()
      .click();

    // After clicking a tour, the form should be populated with a non-empty title.
    cy.get('input[formcontrolname="title"]').invoke('val').should('be.a', 'string').and('not.eq', '');
  });
});


