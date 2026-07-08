import type { Provider } from '../context/ProviderContext';
import type { ProviderMocks } from './types';
import { awsMocks } from './aws';
import { azureMocks } from './azure';
import { combinedMocks } from './combined';
import { awsMocks as awsData } from './aws';
import { azureMocks as azureData } from './azure';

// Merge resources and security events for combined view
const mergedCombined: ProviderMocks = {
  ...combinedMocks,
  resources: [...awsData.resources, ...azureData.resources],
  securityEvents: [...awsData.securityEvents, ...azureData.securityEvents],
  blockedIps: [...awsData.blockedIps, ...azureData.blockedIps],
};

export function getProviderMocks(provider: Provider): ProviderMocks {
  switch (provider) {
    case 'aws':      return awsMocks;
    case 'azure':    return azureMocks;
    case 'combined': return mergedCombined;
    default:         return mergedCombined;
  }
}

export { awsMocks, azureMocks, combinedMocks };
export type { ProviderMocks };
