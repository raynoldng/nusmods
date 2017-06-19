// @flow
// Assumes that boolector.js is already loaded
/* eslint-disable no-undef */
/* eslint-disable func-names */
const solveString = Module.cwrap('solve_string', 'string', ['string', 'number']);

export function solve(smtQuery: String) {
  let output = '';
  Module.print = function (x) {
    output += `${x}\n`;
  };
  Module.printErr = function (x) {
    output += `${x}\n`;
  };

  solveString(smtQuery, 2);
  return output;
}

export function slotsFromModel(model) {
  return model;
}
