import { Client } from '@opensearch-project/opensearch';
import { OpensearchConfiguration } from '../../../../../shared/domain/teleinfo-config';

export function createOpenSearchClient(config: OpensearchConfiguration) {
  const { instance, user, password } = config;
  const instanceURL = new URL(instance);

  // Create a client with SSL/TLS enabled.
  const client = new Client({
    node: `${instanceURL.protocol}//${user}:${password}@${instanceURL.hostname}:${instanceURL.port}`,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return client;
}
