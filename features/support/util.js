const generate = require("../../../openapi-forge/src/generate");

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

let mock = {
  serverResponse: undefined,
};

function createApi(serverIndex = 0) {
  try {
    const Api = require("../api/api.js");
    const Configuration = require("../api/configuration.js");
    const mockTransport = async (params) => {
      mock.requestParams = params;
      return {
        data: mock.serverResponseObject
      };
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
