import { BeforeStep, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";

let _testServerAddress = "";
let _context = {};

function createUser(data) {
  return fetch(`${_testServerAddress}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

BeforeStep(function () {
  _testServerAddress = this.testServerAddress;
});

When(
  "I create a new user with the following details 5:",
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 400);
    _context.userData = await response.json();
  }
);

Then(
  "I should receive an error message that the birth date is invalid",
  async function () {
    assert.strictEqual(_context.userData.message, "Birth Date is invalid");
  }
);
