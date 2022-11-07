function parseTestResultNumber(number) {
  const result = parseInt(number);
  return isNaN(result) ? 0 : result;
}

function parse(results) {
  const ll = results.length;

  const failLineRegex = /\d+\)\sScenario:\s(.*)\s#.*/;
  let failures = [];
  let rr;
  for (let xx = 0; xx < ll; xx++) {
    if ((rr = results[xx].match(failLineRegex))) failures.push(rr[1]);
  }

  let result = {};
  result.failures = failures;

  // Extract the duration of the testing from stdout.
  const durationMatch = results[ll - 2].match(/^(\d+)m(\d+)\.\d+s/);

  if (durationMatch) {
    // Format the duration
    let time = "";
    if (durationMatch[1] !== "0" && durationMatch[1] !== "")
      time = `${durationMatch[1]}m`;
    time = `${time}${durationMatch[2]}s`;

    // Extract the results of the testing from stdout. In stdout is a count of tests and their outcomes.
    const resultMatch = results[ll - 4].match(
      /^(\d+)\sscenarios?\s\(((\d+)\sfailed)?(,\s)?((\d+)\sundefined)?(,\s)?((\d+)\spassed)?\)/
    );
    if (resultMatch) {
      result.scenarios = parseTestResultNumber(resultMatch[1]);
      result.passed = parseTestResultNumber(resultMatch[9]);
      result.skipped = 0;
      result.undef = parseTestResultNumber(resultMatch[6]);
      result.failed = parseTestResultNumber(resultMatch[3]);
      result.time = time;
    } else {
      throw new Error(`Could not parse the results of the TypeScript testing.`);
    }
  } else {
    throw new Error(`Could not parse the duration of the TypeScript testing.`);
  }
  return result;
}

module.exports = {
  parse,
};
