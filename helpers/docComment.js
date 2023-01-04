const indent = (text) =>
  // add a star before each newline and the start of the string
  text.replace(/^/gm, " * ");

module.exports = indent;
