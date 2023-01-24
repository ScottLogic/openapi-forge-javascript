function exportHelper(isDefault = true) {
  switch (process.env.moduleFormat) {
    case "esmodule":
      return `export ${isDefault ? "default " : ""}`;
    case "commonjs":
    default:
      return `module.exports = `;
  }
}

module.exports = exportHelper;
