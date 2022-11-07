const { Given, When, Then, After } = require("@cucumber/cucumber");
const { assert, expect } = require("chai");
const { existsSync, rmSync } = require("fs");

// Retrieve the path to generate.js from cl arguments of cucumber-js
const cliArgs = process.argv.slice(2);
const generatePath = cliArgs[cliArgs.length - 1];

if (!generatePath) {
  throw new Error(`You must provide a path to generate.js.`);
}

const generate = require(generatePath);

const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

async function generateApi(schema) {
  await generate(JSON.parse(schema), ".", {
    output: "./features/api",
    testRun: true,
    skipValidation: false,
    logLevel: "quiet",
  });
}

let api, requestParams, serverResponseObject;

After(() => {
  // cache-bust the api that was loaded via CommonJS
  Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key];
  });
  if (existsSync("./features/api")) {
    rmSync("./features/api", { recursive: true });
  }
});

function createApi(serverIndex = 0) {
  const Api = require("../api/api.js");
  const Configuration = require("../api/configuration.js");
  const mockTransport = async (params) => {
    requestParams = params;
    return serverResponseObject;
  };

  const config = new Configuration(mockTransport);
  config.selectedServerIndex = serverIndex;

  return new Api(config);
}

Given("an API with the following specification", async (schema) => {
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

Then(/the requested URL should be (.*)/, (url) => {
  assert.equal(requestParams.url, url);
});
