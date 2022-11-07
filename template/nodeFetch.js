const fetch = require("node-fetch");

async function transport(params) {
  const response = await fetch(params.url, params);
  if (response.status !== 200) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return await response.json();
}

module.exports = transport;
