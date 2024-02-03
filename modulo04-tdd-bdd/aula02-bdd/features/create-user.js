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

async function findUserById(id) {
  const user = await fetch(`${_testServerAddress}/users/${id}`);
  return user.json();
}

BeforeStep(function () {
  _testServerAddress = this.testServerAddress;
});

When(
  "I create a new user with the following details:",
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 201);
    const userData = await response.json();
    _context.users = new Map().set("1", userData);
    assert.ok(userData.id);
  }
);

Then("I request the API with the user's ID", async function () {
  const user = await findUserById(_context.users.get("1").id);
  _context.createdUserData = user;
});

Then(
  "I should receive a JSON response with the user's details",
  async function () {
    const expectedKeys = ["name", "birthDay", "id", "category"];

    assert.deepStrictEqual(
      Object.keys(_context.createdUserData).sort(),
      expectedKeys.sort()
    );
  }
);

Then("The user's category should be {string}", async function (category) {
  assert.strictEqual(_context.createdUserData.category, category);
});

When(
  "I create a new user with the following details 2:",
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 201);
    const userData = await response.json();
    _context.users = new Map().set("2", userData);
    assert.ok(userData.id);
  }
);

Then(
  "the user should be categorized as an {string}",
  async function (category) {
    const user = await findUserById(_context.users.get("2").id);
    _context.createdUserData = user;
    assert.strictEqual(_context.createdUserData.category, category);
  }
);

When("I request the user with ID {string}", async function (id) {
  const user = await findUserById(_context.users.get(id).id);
  _context.createdUserData = user;
});

Then("the user's category should be {string}", function (category) {
  assert.strictEqual(_context.createdUserData.category, category);
});

When(
  "I create a new user with the following details 3:",
  async function (dataTable) {
    const [data] = dataTable.hashes();
    const response = await createUser(data);
    assert.strictEqual(response.status, 201);
    const userData = await response.json();
    _context.users = new Map().set("3", userData);
    assert.ok(userData.id);
  }
);

Then(
  "the user should be categorized as a {string}",
  async function (category) {
    const user = await findUserById(_context.users.get("3").id);
    _context.createdUserData = user;
    assert.strictEqual(_context.createdUserData.category, category);
  }
);

