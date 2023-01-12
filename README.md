# OpenAPI Forge - JavaScript

This repository is the JavaScript generator for the [OpenAPI Forge](https://github.com/ScottLogic/openapi-forge), see that repository for usage instructions:

https://github.com/ScottLogic/openapi-forge

The client API it generates is suitable for running in the browser (after being bundled appropriately), or via node. The generated code uses the Fetch API, and as a result you'll need to use node v18 or greater.

## Example

You should consult the [OpenAPI Forge](https://github.com/ScottLogic/openapi-forge) repository for a complete user guide. The following is a very brief example that quikcly gets you up-and-running with this generator.

Run the `forge` command to generate a client API using this generator as follows:

```
$ openapi-forge forge \
                https://petstore3.swagger.io/api/v3/openapi.json \
                openapi-forge-javascript \
                -o api
```

This will generate various files in the `api` folder.

### Running with node (>= v18)

Add the following `index.js` in the `api` folder:

```javascript
const ApiPet = require("./apiPet");
const Configuration = require("./configuration");
const transport = require("./fetch");

// create an API client
const config = new Configuration(transport);
config.basePath = "https://petstore3.swagger.io";
const api = new ApiPet(config);

// use it!
(async () => {
  await api.addPet({
    id: 1,
    name: "Fido",
    photoUrls: [],
  });

  const pet = await api.getPetById(1);
  console.log(pet.name);
})();
```

To test the API, this example adds a Pet named “Fido” to the Pet Store, then retrieves it via its id, logging the name. You can run the example as follows:

```
% node index.js
Fido
```

### Running in the browser

You'll need to bundle the files into a single script, there are various tools that can be used for this purpose, but browserify is one of the simplest:

```
% npx browserify index.js -o bundle.js
```

Next create a simple HTML file that loads this script:

```
<html>
<script src="bundle.js"></script>
</html>
```

Load the above page in a browser and you should see `Fido` logged to the console.

## Development

The OpenAPI Forge project [details the process for creating a new generator](https://github.com/ScottLogic/openapi-forge#generator-development). The documentation gives a few generator-specific instructions.

### Running

To run this generator, you also need to have [OpenAPI Forge] installed, or the repository checked out. Assuming you have it installed as a global module, you can run this generator as follows:

```
$ openapi-forge forge \
                https://petstore3.swagger.io/api/v3/openapi.json \
                . \
                -o api \
```

This generates an API from the Pet Store swagger definition, using the generator within the current folder (`.`), outputting the results to the `api` folder.

### Testing

The standard test script is used to execute the BDD-style tests against this generator.

```
npm run test
```

The script expects that the openapi-forge project (which is where the BDD feature files are located) is checked out at the same folder-level as this project.

### Linting

Two scripts are available to help you find linting errors:

```
npm run lint:check:all
```

This runs eslint in check mode which will raise errors found but not try and fix them. This is also ran on a PR and a push to main. It will fail if any errors were found.

```
npm run lint:write:all
```

This runs eslint in write mode which will raise errors found and try to fix them.
