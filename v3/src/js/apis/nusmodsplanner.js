// @flow
import type { ModuleCode } from 'types/modules';
// TODO migrate url to config
const plannerBaseUrl: string = 'http://localhost:3001/api/freeday';

const NUSModsPlannerApi = {
  plannerBaseUrl: (): string => plannerBaseUrl,

  plannerQueryUrl: (compModuleCodes: Array<ModuleCode>, optModuleCodes: Array<ModuleCode>, numMods: number): string => {
    const compMods = compModuleCodes ? compModuleCodes.join(',') : 'null';
    const optMods = optModuleCodes ? optModuleCodes.join(',') : 'null';
    return `${plannerBaseUrl}/${numMods}/${compMods}/${optMods}`;
  },
};

export default NUSModsPlannerApi;
