const assert = require("node:assert/strict");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const { app } = require("../app");
const Product = require("../models/product");
const User = require("../models/user");
const API_PREFIX = `/api/${process.env.API_VERSION || "v1"}`;

function stubMethod(target, methodName, implementation) {
  const original = target[methodName];
  target[methodName] = implementation;
  return () => {
    target[methodName] = original;
  };
}

async function run() {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: "E-commerce API is running" });

  const notFoundResponse = await request(app).get("/unknown-route");

  assert.equal(notFoundResponse.status, 404);
  assert.deepEqual(notFoundResponse.body, { message: "Route not found" });

  const newProductPayload = {
    name: "Laptop",
    description: "Portable computer",
    price: 1200,
    stock: 10,
  };

  const restoreCreate = stubMethod(Product, "create", async (payload) => ({
    id: 1,
    ...payload,
  }));

  try {
    const createResponse = await request(app)
      .post(`${API_PREFIX}/products`)
      .send(newProductPayload);

    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.body.id, 1);
    assert.equal(createResponse.body.name, newProductPayload.name);
    assert.equal(
      createResponse.body.description,
      newProductPayload.description,
    );
    assert.equal(Number(createResponse.body.price), newProductPayload.price);
    assert.equal(createResponse.body.stock, newProductPayload.stock);
  } finally {
    restoreCreate();
  }

  const mockProducts = [
    {
      id: 1,
      name: "Laptop",
      description: "Portable computer",
      price: "1200.00",
      stock: 10,
    },
  ];

  const restoreFindAll = stubMethod(
    Product,
    "findAll",
    async () => mockProducts,
  );

  try {
    const productsResponse = await request(app).get(`${API_PREFIX}/products`);

    assert.equal(productsResponse.status, 200);
    assert.deepEqual(productsResponse.body, mockProducts);
  } finally {
    restoreFindAll();
  }

  const newUserPayload = {
    name: "Edina Dawa",
    email: "edina@example.com",
  };

  const restoreUserCreate = stubMethod(User, "create", async (payload) => ({
    id: 1,
    ...payload,
  }));

  try {
    const createUserResponse = await request(app)
      .post(`${API_PREFIX}/users`)
      .send(newUserPayload);

    assert.equal(createUserResponse.status, 201);
    assert.equal(createUserResponse.body.id, 1);
    assert.equal(createUserResponse.body.name, newUserPayload.name);
    assert.equal(createUserResponse.body.email, newUserPayload.email);
  } finally {
    restoreUserCreate();
  }

  const mockUsers = [
    {
      id: 1,
      name: "Edina Dawa",
      email: "edina@example.com",
    },
  ];

  const restoreUserFindAll = stubMethod(User, "findAll", async () => mockUsers);

  try {
    const usersResponse = await request(app).get(`${API_PREFIX}/users`);

    assert.equal(usersResponse.status, 200);
    assert.deepEqual(usersResponse.body, mockUsers);
  } finally {
    restoreUserFindAll();
  }

  const restoreFindOneForRegister = stubMethod(
    User,
    "findOne",
    async () => null,
  );
  const restoreCreateForRegister = stubMethod(
    User,
    "create",
    async (payload) => ({
      id: 10,
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  );

  try {
    const registerResponse = await request(app)
      .post(`${API_PREFIX}/auth/register`)
      .send({
        name: "Auth User",
        email: "auth@example.com",
        password: "StrongPass123!",
      });

    assert.equal(registerResponse.status, 201);
    assert.equal(registerResponse.body.user.email, "auth@example.com");
    assert.ok(typeof registerResponse.body.token === "string");
  } finally {
    restoreCreateForRegister();
    restoreFindOneForRegister();
  }

  const passwordHash = await bcrypt.hash("StrongPass123!", 10);
  const restoreFindOneForLogin = stubMethod(User, "findOne", async () => ({
    id: 10,
    name: "Auth User",
    email: "auth@example.com",
    role: "CUSTOMER",
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  try {
    const loginResponse = await request(app)
      .post(`${API_PREFIX}/auth/login`)
      .send({
        email: "auth@example.com",
        password: "StrongPass123!",
      });

    assert.equal(loginResponse.status, 200);
    assert.equal(loginResponse.body.user.email, "auth@example.com");
    assert.ok(typeof loginResponse.body.token === "string");
  } finally {
    restoreFindOneForLogin();
  }

  const protectedRouteResponse = await request(app).get(`${API_PREFIX}/carts`);
  assert.equal(protectedRouteResponse.status, 401);
  assert.equal(protectedRouteResponse.body.message, "Unauthorized");

  console.log("PASS test/app.test.js");
}

run().catch((error) => {
  console.error("FAIL test/app.test.js");
  console.error(error);
  process.exit(1);
});
