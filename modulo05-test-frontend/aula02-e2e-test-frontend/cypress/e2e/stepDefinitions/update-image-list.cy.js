import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { registerForm } from "../common/registerForm.cy.js";

Then("I have entered {string} in the title field", (text) => {
  registerForm.typeTitle(text);
});

Then("I have entered {string} in the URL field", (text) => {
  registerForm.typeUrl(text);
});

