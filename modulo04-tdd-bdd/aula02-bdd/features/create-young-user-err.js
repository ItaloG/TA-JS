import { BeforeStep, When, Given, Then } from "@cucumber/cucumber";
import assert from "node:assert";

let _testServerAddress = "";
let _context = {};

BeforeStep(function () {
  _testServerAddress = this.testServerAddress;
});

function createUser(data) {
  return fetch(`${_testServerAddress}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

When(
  "I create a young user with the following details:",
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 400);
    _context.userData = await response.json();
  }
);

Then(
  "I should receive an error message that the user must be at least 18 years old",
  async function () {
    assert.strictEqual(_context.userData.message, "User must be 18yo or older");
  }
);
