const model = require("./model");
const { serialize } = require("./serializer");

// builds the request parameters from the API method arguments, handling
// serialisation and 'exploding' of object properties
class ParameterBuilder {
  parameters = [];

  add(name, value, type, location) {
    // handle model objects
    if (model.models.includes(type)) {
      const properties = model[type].propertyTypes;

      // how this is handled, depends on the location
      if (location === "path") {
        // path parameters are serialized as a comma separated list
        const objectValue = properties
          .map(
            (prop) => `${prop.name},${serialize(value[prop.name], prop.type)}`
          )
          .join(",");

        this.parameters.push({
          name,
          value: objectValue,
          location,
        });
      } else if (location === "body") {
        // body parameters are serialized as JSON
        this.parameters.push({
          name,
          value: serialize(value, type),
          location,
        });
      } else {
        // for query, header and cookie parameters, each object property becomes a new parameter
        properties.forEach((prop) => {
          this.parameters.push({
            name: prop.name,
            value: value[prop.name],
            location,
          });
        });
      }
    } else if (type.endsWith("[]")) {
      const itemType = type.slice(0, -2);
      // array handling depends on location
      if (location === "path") {
        // path parameters are comma separated
        const csv = value.map(v => serialize(v, itemType)).join(",");
        this.parameters.push({
          name,
          value: csv,
          location,
        });
      } else {
        // for others, each item becomes a new parameter
        value.forEach((item) => {
          this.parameters.push({
            name,
            value: serialize(item, itemType),
            location,
          });
        });
      }
    } else {
      // handle simple property types
      this.parameters.push({
        name,
        value: serialize(value, type),
        location,
      });
    }
  }
}

module.exports = ParameterBuilder;