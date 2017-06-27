// @flow
// Assumes that boolector.js is already loaded
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/* eslint-disable no-eval */

import _ from 'lodash';
// import { getModuleTimetable } from 'utils/modules';

export function solve(smtQuery: String, cb) {
  fetch('http://localhost:3001/static/boolector.js').then((data) => { return data.text(); }).then((data) => {
    eval(data);
    const solveString = Module.cwrap('solve_string', 'string', ['string', 'number']);
    let output = '';
    Module.print = function (x) {
      output += x + '\n';
    };
    Module.printErr = function (x) {
      output += x + '\n';
    };
    const result = solveString(query, 2);
    const outcome = [output, result];
    return outcome;
  }).then((outcome) => {
    cb(outcome);
  });
}

export function parseOutput(output: String) {
  const outputArr = output.split('\n');
  const result = {
    result: outputArr[0],
  };
  for (let i = 1; i < outputArr.length; i += 1) {
    const line = outputArr[i].trim();

    const key = line.substring(0, line.lastIndexOf(' ')).replace(/\|/g, '');
    const value = line.substring(line.lastIndexOf(' '));
    result[key] = parseInt(value, 2);
  }
  return result;
}

export function slotsFromModel(output: String, compModuleCodes: Array<ModuleCode>,
  optModuleCodes: Array<ModuleCode>, numMods: number, moduleMapping) {
  const model = parseOutput(output);
  const modsList = [...compModuleCodes, ...optModuleCodes];
  // map indices to choosen mods
  const chosenMods = _.range(0, numMods).map((i) => {
    const a = model[`x_${i}`];
    // console.log(`x_${i} : ${a}`);
    return modsList[a];
  });
  // console.log('here is the model');
  // console.log(model);

  // console.log('here are the mods');
  // console.log(chosenMods);

  // map module codes to module objects
  // map choosen mods to lessons of that mod and then to key value pair
  const chosenModsLessons = Object.keys(model).filter((k) => {
    return chosenMods.reduce((acc, val) => {
      return acc || k.startsWith(val);
    }, false);
  });
  // console.log('lessons in the timetable:');
  // console.log(chosenModsLessons);

  const timetable = chosenModsLessons.map((lesson) => {
    const lesson2 = lesson.split('_');
    const mod = lesson2[0];
    const lessonType = lesson2[1];
    const lessonTypeSlot = moduleMapping[mod][lessonType][model[`${mod}_${lessonType}`]];
    return `${mod}_${lessonType}_${lessonTypeSlot}`;
  });
  return timetable;
}
