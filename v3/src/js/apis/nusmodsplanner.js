// @flow
import type { ModuleCode } from 'types/modules';
// TODO migrate url to config
import config from 'config/app-config.json';

const plannerBaseUrl: string = config.live ? 'http://modsplanner.tk:3001/api' : 'http://localhost:3001/api';

const NUSModsPlannerApi = {
  plannerBaseUrl: (): string => plannerBaseUrl,

  plannerQueryUrl: (options, compModuleCodes: Array<ModuleCode>, optModuleCodes: Array<ModuleCode>,
                    numMods: number): string => {
    const compMods = compModuleCodes.length !== 0 ? compModuleCodes.join(',') : 'null';
    const optMods = optModuleCodes.length !== 0 ? optModuleCodes.join(',') : 'null';
    const opts = options || {};
    return `${plannerBaseUrl}/${numMods}/${compMods}/${optMods}/${encodeURIComponent(JSON.stringify(opts))}`;
  },
};

export default NUSModsPlannerApi;
