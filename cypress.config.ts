import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
    env: {
      ADMIN_EMAIL: 'julianshaw2000@gmail.com',
      ADMIN_PASSWORD: 'Gl@ria100'
    }
  }
});


