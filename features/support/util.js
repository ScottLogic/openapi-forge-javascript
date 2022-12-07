const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

// Retrieve the path to generate.js from cl arguments of cucumber-js
const cliArgs = process.argv.slice(2);
const generatePath = cliArgs[cliArgs.length - 1];

if (!generatePath) {
  throw new Error(`You must provide a path to generate.js.`);
}

const generate = require(generatePath);

async function generateApi(schema) {
  await generate(JSON.parse(schema), ".", {
    output: "./features/api",
    testRun: true,
    skipValidation: false,
    logLevel: "quiet",
  });
}

let mock = {
  serverResponse: undefined,
};

function createApi(serverIndex = 0) {
  try {
    const Api = require("../api/api.js");
    const Configuration = require("../api/configuration.js");
    const mockTransport = async (params) => {
      mock.requestParams = params;
      return mock.serverResponseObject;
    };

    const config = new Configuration(mockTransport);
    config.selectedServerIndex = serverIndex;

    return new Api(config);
  } catch {
    return null;
  }
}

module.exports = {
  isJson,
  generateApi,
  createApi,
  mock,
};
