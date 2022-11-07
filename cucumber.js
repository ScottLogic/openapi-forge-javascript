// cucumber.js

// Retrieve the path to feature paths from cl arguments of cucumber-js
const cliArgs = process.argv.slice(2);
const featurePath = cliArgs[cliArgs.length - 2];
if (!featurePath) {
  throw new Error(`You must provide a path to the feature files.`);
}

let common = [
  featurePath, // Specify our feature files
  "--require features/support/*.js", // Load step definitions
].join(" ");

module.exports = {
  default: common,
};
