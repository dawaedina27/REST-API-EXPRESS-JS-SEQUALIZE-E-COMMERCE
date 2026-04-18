const assert = require("node:assert/strict");
const requireJson = require("../../middleware/requireJson");
const notFound = require("../../middleware/notFound");
const errorHandler = require("../../middleware/errorHandler");

function createMockRes() {
  return {
    headersSent: false,
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
}

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

run("requireJson allows non-write methods", () => {
  const req = { method: "GET", is: () => false };
  const res = createMockRes();
  let nextCalled = false;

  requireJson(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
});

run("requireJson blocks write methods without application/json", () => {
  const req = { method: "POST", is: () => false };
  const res = createMockRes();
  let nextCalled = false;

  requireJson(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 415);
  assert.deepEqual(res.payload, {
    message: "Unsupported Media Type",
    error: "Content-Type must be application/json",
  });
});

run("requireJson allows write methods with application/json", () => {
  const req = { method: "PUT", is: (type) => type === "application/json" };
  const res = createMockRes();
  let nextCalled = false;

  requireJson(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
});

run("notFound returns 404 with route-not-found message", () => {
  const req = {};
  const res = createMockRes();

  notFound(req, res);

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.payload, { message: "Route not found" });
});

run("errorHandler returns provided status and message", () => {
  const previousEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  const err = new Error("Boom");
  err.status = 400;
  const req = {};
  const res = createMockRes();
  let nextCalled = false;

  errorHandler(err, req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.message, "Boom");
  assert.ok(typeof res.payload.error === "string");

  process.env.NODE_ENV = previousEnv;
});

run("errorHandler hides stack trace in production", () => {
  const previousEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  const err = new Error("Internal server error");
  const req = {};
  const res = createMockRes();

  errorHandler(err, req, res, () => {});

  assert.equal(res.statusCode, 500);
  assert.equal(res.payload.message, "Internal server error");
  assert.equal(res.payload.error, undefined);

  process.env.NODE_ENV = previousEnv;
});

if (process.exitCode) {
  process.exit(process.exitCode);
}
