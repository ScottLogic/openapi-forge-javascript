// there are issues with running prettier as a CLI command
// see: https://github.com/ScottLogic/openapi-forge/issues/133
// this is a workaround to run the prettier CLI as a node module
const cli = require("prettier/cli.js");

// map forge log levels to prettier log levels
const logLevels = [
  /* quiet */
  "silent",
  /* standard */
  "warn",
  /* verbose */
  "debug",
];

module.exports = (folder, logLevel) => {
  return cli.run(["--write", folder, "--loglevel", logLevels[logLevel]]);
};
