describe('Vivid History app', () => {
  it('loads home and navigates to London tour split view', () => {
    cy.visit('/');
    cy.contains('Vivid History').should('be.visible');
    cy.contains('Vivid History: London Walking Tour')
      .parent()
      .parent()
      .contains('Start tour')
      .click();
    cy.url().should('include', '/tour/');
    cy.contains('Split').should('have.class', 'vh-mode-chip-active');
    cy.contains('Next').should('be.visible');
  });

  it('loads Brixton tour from home', () => {
    cy.visit('/');
    cy.contains('Vivid History: Brixton Walking Tour')
      .parent()
      .parent()
      .contains('Start tour')
      .click();
    cy.url().should('include', '/tour/brixton-vivid-history');
    cy.contains('Brixton Walking Tour').should('be.visible');
  });
});


