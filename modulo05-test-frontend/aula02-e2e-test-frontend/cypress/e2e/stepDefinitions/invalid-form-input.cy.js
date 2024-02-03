import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy.js";

Then("I should see {string} message above the title field", (text) => {
  registerForm.elements.titleFeedback().should("contain.text", text);
});

Then("I should see {string} message above the imageUrl field", (text) => {
  registerForm.elements.urlFeedback().should("contain.text", text);
});

Then("I should see an exclamation icon in the title and URL fields", (text) => {
  registerForm.elements.titleInput().should('have.css', 'background-image', `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")`)
  registerForm.elements.imageUrlInput().should('have.css', 'background-image', `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")`)
});
