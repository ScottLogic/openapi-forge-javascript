const { Given, When, Then, After } = require("@cucumber/cucumber");
const { assert, expect } = require("chai");
const { existsSync, rmSync } = require("fs");
const { isJson, generateApi, createApi, mock } = require("./util.js");

After(() => {
  // cache-bust the api that was loaded via CommonJS
  Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key];
  });
  if (existsSync("./features/api")) {
    rmSync("./features/api", { recursive: true });
  }
});

let api, apiResponse;

Given("an API with the following specification", async (schema) => {
  await generateApi(schema);
  api = createApi();
});

When("generating an API from the following specification", async (schema) => {
  await generateApi(schema);
  api = createApi();
});

When(
  /calling the method ([a-zA-Z]*) with parameters "(.*)"/,
  async (methodName, params) => {
    let values = params.split(",");
    if (!api[methodName]) {
      console.error(`Method ${methodName} not found`);
    }
    values = values.map((value) => (isJson(value) ? JSON.parse(value) : value));
    await api[methodName](...values);
  }
);

When(
  /calling the method ([a-zA-Z]*) with object (.*)/,
  async (methodName, value) => {
    if (!api[methodName]) {
      console.error(`Method ${methodName} not found`);
    }
    await api[methodName](JSON.parse(value));
  }
);

When(
  /calling the method ([a-zA-Z]*) with array "(.*)"/,
  async (methodName, array) => {
    if (!api[methodName]) {
      console.error(`Method ${methodName} not found`);
    }
    await api[methodName](array.split(","));
  }
);

When(
  /calling the method ([a-zA-Z]*) and the server responds with/,
  async (methodName, response) => {
    mock.serverResponseObject = JSON.parse(response);
    apiResponse = await api[methodName]();
  }
);

When(
  /calling the method ([a-zA-Z]*) and the server provides an empty response/,
  async (methodName) => {
    mock.serverResponseObject = null;
    apiResponse = await api[methodName]();
  }
);

When(/extracting the object at index ([0-9]*)/, (index) => {
  apiResponse = apiResponse[parseInt(index)];
});

When(
  /calling the( spied)? method ([a-zA-Z]*) without params/,
  async (foo, methodName) => {
    if (!api[methodName]) {
      console.error(`Method ${methodName} not found`);
    }

    await api[methodName]();
  }
);

When("selecting the server at index {int}", (index) => {
  api = createApi(index);
});

Then(/the request method should be of type (.*)/, (type) => {
  assert.equal(mock.requestParams.method, type);
});

Then(
  /the request should have a header property with value (.*)/,
  (headerParam) => {
    expect(mock.requestParams.headers).to.have.property("test", headerParam);
  }
);

Then(
  /the request header should have a cookie property with value (.*)/,
  (cookieParam) => {
    expect(mock.requestParams.headers).to.have.property("cookie", cookieParam);
  }
);

Then(/the response should be of type (.*)/, (type) => {
  assert.equal(apiResponse.constructor.name, type);
});

Then(
  /the response should have a property ([a-zA-Z]*) with value (.*)/,
  (propName, propValue) => {
    const value = apiResponse[propName];
    const formattedValue =
      value instanceof Date ? value.toISOString() : value.toString();
    assert.equal(formattedValue, propValue);
  }
);

Then(/the response should be an array/, () => {
  assert.isArray(apiResponse);
});

Then(/the requested URL should be (.*)/, (url) => {
  assert.equal(mock.requestParams.url, url);
});

Then(/the request should have a body with value (.*)/, (body) => {
  assert.equal(mock.requestParams.body, body);
});

Then(/the response should be equal to "(.*)"/, (value) => {
  assert.equal(apiResponse, value);
});

Then(/the response should be null/, () => {
  assert.isNull(apiResponse);
});

Then(/it should generate a model object named (\w*)/, (modelName) => {
  const models = require("../api/model.js");
  assert.isDefined(
    models[modelName],
    `Model object named [${modelName}] not found`
  );
});

Then(
  /(\w*) should have (an optional|a required) property named (\w*) of type (\w*)/,
  // eslint-disable-next-line no-unused-vars
  (modelName, _, propertyName, __) => {
    const models = require("../api/model.js");
    assert.isDefined(
      models[modelName],
      `Model object named [${modelName}] not found`
    );

    const modelInstance = new models[modelName]();
    assert(
      Object.prototype.hasOwnProperty.call(modelInstance, propertyName),
      `Model property [${propertyName}] not found on object [${modelName}]`
    );

    // note, for the purposes of this test, we're only checking the property name and type
    // JavaScript cannot enforce required/optional properties or types
  }
);
