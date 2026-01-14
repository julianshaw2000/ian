describe.skip('CityHistoryWalks admin media management', () => {
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
    it('can upload image and audio media for a POI and see it in the list', () => {
      cy.viewport(1280, 800);
      login();

      // Go to tours manager
      cy.visit('/admin/tours');

      // Ensure there is at least one tour and open its POIs manager
      cy.get('.vh-admin-tours li').first().as('firstTourRow');
      cy.get('@firstTourRow').within(() => {
        // Click the row button to select the tour so tourId is set in the form
        cy.get('button[mat-button]').click();
        // Open POIs manager via the "Manage stops" icon button
        cy.get('a[aria-label="Manage stops"]').click();
      });

      cy.url().should('include', '/admin/tours/').and('include', '/pois');

      // On POIs page, ensure there is at least one POI; if not, skip the rest of this test gracefully.
      cy.get('body').then(($body) => {
        const poiItems = $body.find('.vh-admin-pois li');
        if (!poiItems.length) {
          cy.log('No POIs available for this tour; skipping media upload assertions.');
          return;
        }

        cy.wrap(poiItems.first()).within(() => {
          cy.get('a[aria-label="Manage media"]').click();
        });
      });

      // Wait until media page is loaded (list present) before measuring
      cy.get('.vh-admin-media', { timeout: 10000 }).should('exist');

      // Capture initial media count (may be 0)
      cy.get('.vh-admin-media li').its('length').then((initialCount) => {

        // === Upload image media ===
        cy.contains('button', 'New media').click();

        // Select media type = Image
        cy.get('mat-select[formcontrolname="media_type"]').click();
        cy.get('mat-option[value="image"]').click();

        // Upload a test image file
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.png', { force: true });

        // Fill in label and sort order
        const imageLabel = `E2E image ${Date.now()}`;
        cy.get('input[formcontrolname="label"]').clear().type(imageLabel);
        cy.get('input[formcontrolname="sort_order"]').clear().type('10');

        // Save media
        cy.contains('button', 'Save').click();

        // Media list should increase
        cy.get('.vh-admin-media li', { timeout: 10000 })
          .its('length')
          .should('be.greaterThan', initialCount);

        // === Upload audio media ===
        cy.get('.vh-admin-media li')
          .its('length')
          .then((countAfterImage) => {
            cy.contains('button', 'New media').click();

            cy.get('mat-select[formcontrolname="media_type"]').click();
            cy.get('mat-option[value="audio"]').click();

            cy.get('input[type="file"]').selectFile('cypress/fixtures/test-audio.mp3', {
              force: true
            });

            const audioLabel = `E2E audio ${Date.now()}`;
            cy.get('input[formcontrolname="label"]').clear().type(audioLabel);
            cy.get('input[formcontrolname="sort_order"]').clear().type('20');

            cy.contains('button', 'Save').click();

            cy.get('.vh-admin-media li', { timeout: 10000 })
              .its('length')
              .should('be.greaterThan', countAfterImage);
          });
      });
    });
  });
});


