const assert = require("node:assert/strict");
const request = require("supertest");
const { app } = require("../app");
const Product = require("../models/product");
const User = require("../models/user");

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
      .post("/api/products")
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
    const productsResponse = await request(app).get("/api/products");

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
      .post("/api/users")
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
    const usersResponse = await request(app).get("/api/users");

    assert.equal(usersResponse.status, 200);
    assert.deepEqual(usersResponse.body, mockUsers);
  } finally {
    restoreUserFindAll();
  }

  console.log("PASS test/app.test.js");
}

run().catch((error) => {
  console.error("FAIL test/app.test.js");
  console.error(error);
  process.exit(1);
});
