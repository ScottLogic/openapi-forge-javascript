function typeConvert(prop, options) {
  // the feature tests involve dynamically creating generating multiple APIs, as a result
  // the CommonJS 'require' style of module imports are used so that the cache can be invalidated.
  // ES6 / ESM modules cannot be invalidated! In order to make this work with TypeScript, when using
  // CommonJS, types need to be prefixed with 'typeof'
  if (options && options.testRun) {
    if (prop.$ref || (prop.type === "array" && prop.items.$ref)) {
      return "typeof " + typeConverter(prop);
    }
  }
  return typeConverter(prop);
}

function typeConverter(prop) {
  if (prop == undefined) return "";

  // resolve references
  if (prop.$ref) {
    return prop.$ref.split("/").pop();
  }

  switch (prop.type) {
    case "integer":
    case "number":
      return "number";
    case "string": {
      if (prop.format == "date-time" || prop.format == "date") {
        return "Date";
      }
      return "string";
    }
    case "boolean":
      return "boolean";
    case "array":
      return `${typeConvert(prop.items)}[]`;
    // inline object definition
    case "object":
      if (prop.additionalProperties) {
        return `{ [name: string]: ${typeConvert(prop.additionalProperties)} }`;
      } else {
        return "{}";
      }
  }
  return "";
}

module.exports = typeConvert;
