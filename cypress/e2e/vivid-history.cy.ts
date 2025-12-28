describe('CityHistoryWalks app', () => {
  it('loads home and navigates to London tour split view', () => {
    cy.visit('/');
    cy.contains('City History Walks').should('be.visible');
    cy.contains('CityHistoryWalks: London Walking Tour')
      .closest('mat-card')
      .contains('Start tour')
      .click();
    cy.url().should('include', '/tour/');
    cy.contains('Split').should('have.class', 'vh-mode-chip-active');
    cy.contains('Next').should('be.visible');
  });

  it('loads Brixton tour from home', () => {
    cy.visit('/');
    cy.contains('CityHistoryWalks: Brixton Walking Tour')
      .closest('mat-card')
      .contains('Start tour')
      .click();
    cy.url().should('include', '/tour/brixton-vivid-history');
    cy.contains('Brixton Walking Tour').should('be.visible');
  });
});


