// @flow
// Assumes that boolector.js is already loaded
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
import _ from 'lodash';

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

export function parseOutput(output: String) {
  const outputArr = output.split('\n');
  const result = {
    result: outputArr[0],
  };
  for (let i = 1; i < outputArr.length; i += 1) {
    const tokens = outputArr[i].split(' ');
    result[tokens[0]] = parseInt(tokens[1], 2);
  }
  return result;
}

export function slotsFromModel(output: String, compModuleCodes: Array<ModuleCode>,
  optModuleCodes: Array<ModuleCode>, numMods: number) {
  const model = parseOutput(output);
  const modsList = [...compModuleCodes, ...optModuleCodes];
  console.log('here are the mods');
  console.log(modsList);
  // map indices to choosen mods
  const chosenMods = _.range(0, numMods).map((i) => {
    const a = model[`x_${i}`];
    console.log(`x_${i} : ${a}`);
    return modsList[a];
  });
  console.log(chosenMods);
  return numMods;
}
