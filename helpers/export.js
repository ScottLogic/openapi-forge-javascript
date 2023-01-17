function exportHelper(isDefault = true) {
  switch (process.env.moduleFormat) {
    case "esm":
      return `export ${isDefault ? "default " : ""}`;
    case "cjs":
    default:
      return `module.exports = `;
  }
}

module.exports = exportHelper;