function importHelper(type, file) {
  switch (process.env.moduleFormat) {
    case "esm":
      return `import ${type} from "./${file}.js"`;
    case "cjs":
    default: {
      if (type && type.startsWith("* as")) {
        type = type.replace("* as", "");
      }
      return `const ${type} = require("./${file}")`;
    }
  }
}

module.exports = importHelper;
