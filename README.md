## OpenAPI Forge - JavaScript

This repository is the JavaScript template for the [OpenAPI Forge](https://github.com/ColinEberhardt/openapi-forge), see that repository for usage instructions:

https://github.com/ScottLogic/openapi-forge

## Development

### Testing

There are two scripts that can be used for testing, one that uses preset values for file paths to feature files and the `generate.js` file of the forge:

Using default values:

```
npm run test:defaultPaths
```

This method uses:

- `featurePath` - `node_modules/openapi-forge/features/*.feature`
- `generatorPath` - `openapi-forge/src/generate`

The second script requires values for the featurePath & generatePath:

```
npm test {featurePath} {generatorPath}
```

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
