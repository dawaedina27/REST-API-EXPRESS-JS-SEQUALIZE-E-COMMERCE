const assert = require("node:assert/strict");
const { Given, When, Then, After } = require("@cucumber/cucumber");
const request = require("supertest");
const { app } = require("../../app");
const User = require("../../models/user");

let response;
let restoreUserCreate = null;

function stubMethod(target, methodName, implementation) {
  const original = target[methodName];
  target[methodName] = implementation;
  return () => {
    target[methodName] = original;
  };
}

Given("user creation is mocked to succeed", function () {
  restoreUserCreate = stubMethod(User, "create", async (payload) => ({
    id: 1,
    ...payload,
  }));
});

When("I send a GET request to {string}", async function (path) {
  response = await request(app).get(path);
});

When(
  "I send a POST request to {string} with JSON:",
  async function (path, bodyDocString) {
    const payload = JSON.parse(bodyDocString);
    response = await request(app).post(path).send(payload);
  },
);

Then("the response status should be {int}", function (statusCode) {
  assert.equal(response.status, statusCode);
});

Then("the response JSON should be:", function (jsonDocString) {
  const expected = JSON.parse(jsonDocString);
  assert.deepEqual(response.body, expected);
});

Then(
  "the response JSON field {string} should be {string}",
  function (field, expectedValue) {
    assert.equal(response.body[field], expectedValue);
  },
);

After(function () {
  if (restoreUserCreate) {
    restoreUserCreate();
    restoreUserCreate = null;
  }
});
