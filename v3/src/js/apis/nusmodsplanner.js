// @flow
/* eslint-disable no-param-reassign */

import type { ModuleCode } from 'types/modules';
// TODO migrate url to config
// import config from 'config/app-config.json';
import config from 'config/app-config-temp.json';

const plannerBaseUrl: string = config.live ? 'http://modsplanner.tk:3001/api' : 'http://localhost:3001/api';

function shuffle(a) {
  for (let i = a.length; i; i -= 1) {
    const j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}

const NUSModsPlannerApi = {
  plannerBaseUrl: (): string => plannerBaseUrl,

  plannerQueryUrl: (semester, options, compModuleCodes: Array<ModuleCode>, optModuleCodes: Array<ModuleCode>,
                    numMods: number): string => {
    shuffle(compModuleCodes);
    shuffle(optModuleCodes);
    const compMods = compModuleCodes.length !== 0 ? compModuleCodes.join(',') : 'null';
    const optMods = optModuleCodes.length !== 0 ? optModuleCodes.join(',') : 'null';
    const opts = options || {};
    return `${plannerBaseUrl}/${semester}/${numMods}/${compMods}/${optMods}/
    ${encodeURIComponent(JSON.stringify(opts))}`;
  },
};

export default NUSModsPlannerApi;
