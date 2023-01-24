function setVar(varName, options) {
  if (!options.data.root) {
    options.data.root = {};
  }
  options.data.root[varName] = options.fn(this);
  return "";
}

module.exports = setVar;
