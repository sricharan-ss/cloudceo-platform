import { CloudProviderType } from '@prisma/client';

import type { CloudProvider } from './CloudProvider.js';
import { AWSProvider } from './aws/AWSProvider.js';
import { AzureProvider } from './azure/AzureProvider.js';
import { MockCloudProvider } from './mock/MockCloudProvider.js';

export class ProviderFactory {
  static create(providerType: CloudProviderType): CloudProvider {
    if (process.env.CLOUDCEO_PROVIDER_MODE === 'future-real') {
      switch (providerType) {
        case CloudProviderType.AWS:
          return new AWSProvider();
        case CloudProviderType.AZURE:
          return new AzureProvider();
        default:
          return new MockCloudProvider();
      }
    }

    return new MockCloudProvider();
  }
}
