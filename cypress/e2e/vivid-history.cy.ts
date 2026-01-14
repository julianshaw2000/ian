describe('CityHistoryWalks app', () => {
  it('loads home and navigates to London tour split view', () => {
    cy.visit('/');
    cy.contains('City History Walks').should('be.visible');

    // Click the first available tour card
    cy.get('.vh-tour-card').first().within(() => {
      cy.contains('button', 'Start tour').click();
    });
    cy.url().should('include', '/tour/');
    cy.contains('Split').should('have.class', 'vh-mode-chip-active');
    cy.contains('Next').should('be.visible');
  });

  it('loads Brixton tour from home', () => {
    cy.visit('/');

    // Click the second tour card (assumed to be Brixton, based on ordering)
    cy.get('.vh-tour-card').eq(1).within(() => {
      cy.contains('button', 'Start tour').click();
    });

    cy.url().should('include', '/tour/');
    cy.contains('Split').should('be.visible');
  });
});


