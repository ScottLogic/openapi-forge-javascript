const common = {
  paths: ["../openapi-forge/features/*.feature"],
  require: ["features/support/*.js"],
  publishQuiet: true,
};

module.exports = {
  default: common,
  generators: {
    ...common,
    format: ["message"],
  },
};
