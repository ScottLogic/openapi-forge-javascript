TODO - linting


## OpenAPI Forge - TypeScript

This repository is the TypeScript template for the [OpenAPI Forge](https://github.com/ColinEberhardt/openapi-forge), see that repository for usage instructions:

https://github.com/ColinEberhardt/openapi-forge

## Quick Start

Clone and then navigate to root directory of the repository.

Install all the dependencies needed:

```
npm install
```

Once you have a local version, you can reference its location as the 'generator' argument of the 'forge' command of openapi-forge.

```
$ openapi-forge forge
 \ https://petstore3.swagger.io/api/v3/openapi.json
 \ {location of local generator}
 \ -o api
```

## Testing

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

## Linting

Two scripts are available to help you find linting errors:

```
npm run eslint:check:all
```

This runs eslint in check mode which will raise errors found but not try and fix them. This is also ran on a PR and a push to main. It will fail if any errors were found.

```
npm run eslint:write:all
```

This runs eslint in write mode which will raise errors found and try to fix them.

## Notes

The openapi-forge dependency is pointing to commit:0fb044b3a2808e8faf82786f168a12763f5aaeca. If openapi-forge is updated and openapi-forge-typescript requires this updated version then the commit reference in package.json will have to be updated. This is a temporary measure and will be fixed once the packages are properly versioned and hosted on npm.
