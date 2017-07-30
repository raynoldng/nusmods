/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-eval */

let bmodule = 'oh no';

onmessage = function (event) {
  const { semester, options, compMods, optMods, workload, boolector, numTimes } = event.data;
  bmodule = createBoolector(boolector);
  const { result, timetable } = getResultAndTimetable(semester, options, compMods, optMods, workload);
  // console.log(result);
  // console.log(timetable);
  postMessage({ result, timetable, numTimes });
};

function createBoolector(boolector) {
  eval(boolector);
  return Module;
}

function shuffle(a) {
  for (let i = a.length; i; i -= 1) {
    const j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}

const plannerBaseUrl = 'https://modsplanner.tk/api';

const NUSModsPlannerApi = {
  plannerBaseUrl: () => plannerBaseUrl,

  plannerQueryUrl: (semester, options, compModuleCodes, optModuleCodes, numMods) => {
    shuffle(compModuleCodes);
    shuffle(optModuleCodes);
    const compMods = compModuleCodes.length !== 0 ? compModuleCodes.join(',') : 'null';
    const optMods = optModuleCodes.length !== 0 ? optModuleCodes.join(',') : 'null';
    const opts = options || {};
    return `${plannerBaseUrl}/${semester}/${numMods}/${compMods}/${optMods}/
    ${encodeURIComponent(JSON.stringify(opts))}`;
  },
};

function getResultAndTimetable(semester, options, compMods, optMods, workload) {
  const url = NUSModsPlannerApi.plannerQueryUrl(semester, options, compMods, optMods, workload);
  console.log(url);

  const request = new XMLHttpRequest();
  request.open('GET', url, false);  // `false` makes the request synchronous
  request.send(null);

  let smtQuery;
  let moduleMapping;

  if (request.status === 200) {
    const data = JSON.parse(request.responseText);
    smtQuery = data[0];
    moduleMapping = data[1];
  } else {
    return [];
  }
  // console.log(smtQuery);
  // console.log(moduleMapping);
  return resultAndtimetableBuilder(smtQuery, moduleMapping, workload, options);
}

function resultAndtimetableBuilder(smtQuery, moduleMapping, numMods, options) {
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
    const choosenMods = [...Array(newNumMods).keys()].forEach((i) => {
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
  console.log(solveString);
  const result = solveString(query, 2);
  const outcome = [result, output];
  console.log(result);
  console.log(output);
  return outcome;
}

function solveQuery(query) {
  console.log('bmodule is:');
  console.log(bmodule);
  return solve(bmodule, query);
}

function parseOutput(output) {
  // console.log(output);
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
