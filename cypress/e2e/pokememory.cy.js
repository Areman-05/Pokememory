describe('PokeMemory', () => {
  const username = `trainer_${Date.now()}`;
  const email = `${username}@test.com`;

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.sessionStorage.clear();
      },
    });
  });

  it('muestra el formulario de registro al inicio', () => {
    cy.get('#user-form').should('be.visible');
    cy.get('#username').should('exist');
    cy.get('#email').should('exist');
    cy.get('#game').should('not.be.visible');
  });

  it('registra usuario, guarda sessionStorage y muestra el juego', () => {
    cy.get('#username').type(username);
    cy.get('#email').type(email);
    cy.get('#user-form').submit();

    cy.get('#game').should('be.visible');
    cy.get('#user-form').should('not.be.visible');
    cy.get('#game-form').should('exist');
    cy.get('#cards-number').should('exist');
    cy.get('#play-btn').should('exist');
    cy.get('#timer').should('exist');
    cy.get('#game-board').should('exist');
    cy.get('#ranking').should('exist');
    cy.get('#logout-btn').should('exist');

    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('user')).to.be.a('string').and.not.be.empty;
    });
  });

  it('valida número de cartas y abre el modal si no es par positivo', () => {
    cy.get('#username').type(username);
    cy.get('#email').type(email);
    cy.get('#user-form').submit();

    cy.get('#cards-number').clear().type('3');
    cy.get('#game-form').submit();
    cy.get('#modal').should('be.visible');
    cy.get('#modal-message').should('contain', 'par');
    cy.get('#modal button').click();
  });

  it('inicia partida con tablero, timer y clase flipped al clicar', () => {
    cy.get('#username').type(`${username}_play`);
    cy.get('#email').type(`${username}_play@test.com`);
    cy.get('#user-form').submit();

    cy.get('#cards-number').clear().type('4');
    cy.get('#game-form').submit();

    cy.get('#play-btn').should('contain', 'Volver a jugar');
    cy.get('#timer').should('contain', 'm').and('contain', 's');
    cy.get('#game-board .card').should('have.length', 4);

    cy.get('#game-board .card').first().click().should('have.class', 'flipped');
  });

  it('logout elimina user del sessionStorage y vuelve al registro', () => {
    cy.get('#username').type(`${username}_out`);
    cy.get('#email').type(`${username}_out@test.com`);
    cy.get('#user-form').submit();

    cy.get('#logout-btn').click();
    cy.get('#user-form').should('be.visible');
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('user')).to.eq(null);
    });
  });
});
