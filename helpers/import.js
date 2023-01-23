function importHelper(type, file) {
  switch (process.env.moduleFormat) {
    case "esmodule":
      return `import ${type} from "./${file}.js"`;
    case "commonjs":
    default: {
      if (type && type.startsWith("* as")) {
        type = type.replace("* as", "");
      }
      return `const ${type} = require("./${file}")`;
    }
  }
}

module.exports = importHelper;
