// @flow
// Assumes that boolector.js is already loaded
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/* eslint-disable no-eval */
/* eslint-disable no-param-reassign */

import _ from 'lodash';
// import { getModuleTimetable } from 'utils/modules';

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

function solve(boolector, query) {
  let output = '';
  boolector.print = function foo(x) {
    output = `${output}${x}\n`;
    // output += x + '\n';
  };
  boolector.printErr = function bar(x) {
    output = `${output}${x}\n`;
    // output += x + '\n';
  };
  const solveString = boolector.cwrap('solve_string', 'string', ['string', 'number']);
  const result = solveString(query, 2);
  const outcome = [result, output];
  return outcome;
}

function solveQuery(query) {
  const newBoolector = createBoolector();
  return solve(newBoolector, query);
}

export function resultAndtimetableBuilder(smtQuery, moduleMapping, numMods, options) {
  const output = solveQuery(smtQuery);
  const result = output[0];
  const modelOutput = output[1];

  let newNumMods = numMods;

  if (options.freeday) { // need to account for mock module added
    newNumMods += 1;
  }

  const model = parseOutput(modelOutput);
  let timetable = [];

  if (result === 'SAT') {
    const choosenMods = _.range(0, newNumMods).forEach((i) => {
      const modIndex = model[`x_${i}`];
      const module = moduleMapping[modIndex];

      const moduleCode = module[0];
      const lessonsMap = module[1];

      Object.keys(lessonsMap).forEach((lesson) => {
        const choosenSlotIndex = model[`${moduleCode}_${lesson}`];
        const choosenSlotName = lessonsMap[lesson][choosenSlotIndex];
        timetable.push(`${moduleCode}_${lesson}_${choosenSlotName}`);
      });
    });
  }

  console.log('timetable before filter:');
  console.log(timetable);

  timetable = timetable.filter(l => !l.includes('FREEDAY'));

  return { result, timetable };
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
