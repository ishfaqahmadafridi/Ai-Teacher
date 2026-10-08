import { load } from './loadModule.mjs';

export const constants = load('shared/constants/queryConstants.ts');
const { createQueryClient: createProductionQueryClient, getQueryClient } = load('shared/utilities/queryClient.ts', {
  '../constants/queryConstants': constants,
});
export function createQueryClient() {
  const client = createProductionQueryClient();
  const defaults = client.getDefaultOptions();
  client.setDefaultOptions({ ...defaults, queries: { ...defaults.queries, gcTime: 0 } });
  return client;
}


export { getQueryClient };
