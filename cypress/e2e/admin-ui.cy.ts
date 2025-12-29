describe('CityHistoryWalks admin UI end-to-end', () => {
  const email = Cypress.env('ADMIN_EMAIL');
  const password = Cypress.env('ADMIN_PASSWORD');

  const shouldRun = Boolean(email && password);

  const login = () => {
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
  };

  (shouldRun ? describe : describe.skip)('with authenticated admin', () => {
    it('supports core admin flows on desktop (dashboard, tours, POIs)', () => {
      cy.viewport(1280, 800);
      login();

      // Dashboard summary visible
      cy.contains('Admin · CityHistoryWalks').should('be.visible');
      cy.contains('Tours').should('be.visible');

      // Open tours manager from dashboard
      cy.contains('Open tours manager').click();
      cy.url().should('include', '/admin/tours');

      // New tour button is visible with text on desktop
      cy.contains('button', 'New tour').should('be.visible');

      // Create a temporary tour
      const tourId = `e2e-${Date.now()}`;
      cy.contains('button', 'New tour').click();
      cy.get('input[formcontrolname="id"]').clear().type(tourId);
      cy.get('input[formcontrolname="title"]').clear().type('E2E Test Tour');
      cy.get('input[formcontrolname="location"]').clear().type('Test Location');

      cy.contains('button', 'Save').click();

      // Tour appears in list and is selectable
      cy.contains('.vh-admin-tours button', 'E2E Test Tour').click();
      cy.get('input[formcontrolname="title"]')
        .invoke('val')
        .should('eq', 'E2E Test Tour');

      // Navigate to POIs manager from tours list
      cy.contains('.vh-admin-tours li', 'E2E Test Tour')
        .find('a[aria-label="Manage stops"]')
        .click();

      cy.url().should('include', `/admin/tours/${tourId}/pois`);
    });

    it('hides toolbar/button text but keeps icons and tooltips on small screens', () => {
      cy.viewport(375, 667);
      login();
      cy.visit('/admin/tours');

      // Toolbar buttons: spans should be hidden on mobile, icons still visible
      cy.get('.vh-admin-toolbar .vh-admin-button--mobile span').should('have.length.greaterThan', 0);
      cy.get('.vh-admin-toolbar .vh-admin-button--mobile span').each(($span) => {
        cy.wrap($span).should('not.be.visible');
      });
      cy.get('.vh-admin-toolbar .vh-admin-button--mobile mat-icon').each(($icon) => {
        cy.wrap($icon).should('be.visible');
      });

      // Save button uses the mobile class; text should be hidden, icon visible
      cy.get('button.vh-admin-save').as('saveBtn');
      cy.get('@saveBtn').find('span').each(($span) => {
        cy.wrap($span).should('not.be.visible');
      });
      cy.get('@saveBtn').find('mat-icon').should('be.visible');
    });

    it('ensures primary action button size is adequate on desktop and mobile', () => {
      // Desktop size
      cy.viewport(1280, 800);
      login();
      cy.visit('/admin/tours');

      cy.get('button.vh-admin-save').then(($btn) => {
        const rect = $btn[0].getBoundingClientRect();
        expect(rect.width).to.be.greaterThan(120);
        expect(rect.height).to.be.greaterThan(36);
      });

      // Mobile size
      cy.viewport(375, 667);
      cy.visit('/admin/tours');
      cy.get('button.vh-admin-save').then(($btn) => {
        const rect = $btn[0].getBoundingClientRect();
        expect(rect.width).to.be.greaterThan(100);
        expect(rect.height).to.be.greaterThan(40);
      });
    });
  });
});


