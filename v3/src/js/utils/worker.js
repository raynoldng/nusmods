/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

onmessage = function (event) {
  console.log('wowzies');
  console.log(event.data.hello);
  postMessage('hohoho');
};
