describe('Flujo principal', () => {
  it('abre menu y navega a personajes', () => {
    cy.visit('/');
    cy.contains('METAL GEAR ARCHIVE').should('be.visible');
    cy.contains('Personajes').click();
    cy.contains('ion-title', 'Personajes').should('be.visible');
  });

  it('entra en ficha de personaje y muestra juegos relacionados', () => {
    cy.visit('/personajes');
    cy.get('ion-item').first().click();
    cy.contains('ion-title', 'Ficha de Personaje').should('be.visible');
    cy.contains('Juegos relacionados').should('exist');
  });

  it('navega desde evento hacia lugar relacionado', () => {
    cy.visit('/eventos');
    cy.get('ion-item').first().click();
    cy.contains('ion-title', 'Ficha de Evento').should('be.visible');
    cy.contains('Ir a ficha del lugar').click();
    cy.contains('ion-title', 'Ficha de Lugar').should('be.visible');
  });
});
