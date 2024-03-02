import { Client } from '@opensearch-project/opensearch';
import { createOpenSearchClient } from './opensearch-client';

import type { OpensearchConfiguration } from '../../../../../shared/domain/teleinfo-config';

jest.mock('@opensearch-project/opensearch');
const opensearchClientMock = Client as jest.Mock;

describe('Opensearch client helper functions', () => {
  describe('createOpenSearchClient function', () => {
    beforeEach(() => {
      opensearchClientMock.mockReset();
    });

    it('should return an initialized client', () => {
      // given
      const config: OpensearchConfiguration = {
        indexName: '',
        instance: 'http://osinstance:9200',
        user: 'USER',
        password: 'PASS'
      };

      // when
      const actualClient = createOpenSearchClient(config);

      // then
      expect(actualClient).not.toBeUndefined();
      expect(opensearchClientMock).toHaveBeenCalledWith({
        node: 'http://USER:PASS@osinstance:9200',
        ssl: {
          rejectUnauthorized: false,
        },
      });
    });
  });
});
