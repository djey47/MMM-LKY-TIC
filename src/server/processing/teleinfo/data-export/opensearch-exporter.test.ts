import { exportDataToOpensearch } from './opensearch-exporter';
import { createOpenSearchClient } from './helpers/opensearch-client';

import type { StoreDataEntries } from '../helpers/store-models';
import type { ModuleConfiguration } from '../../../../shared/domain/module-config';
import type { Client } from '@opensearch-project/opensearch/.';
import type { OpensearchConfiguration } from '../../../../shared/domain/teleinfo-config';
import parseISO from 'date-fns/parseISO';

jest.mock('./helpers/opensearch-client');
jest.mock('../../../utils/mm2_facades', () => ({
  Log: {
    info: jest.fn(),
  },
  NodeHelper: {},
}));

const createOpenSearchClientMock = createOpenSearchClient as jest.Mock<Client, [OpensearchConfiguration]>;
const osClientMock = {
  index: jest.fn(),
} as unknown as Client;

describe('Opensearch exporter', () => {
  const DOC_DATE = parseISO('2024-03-02T00:00:00.000Z');
  const STATS_DATE = parseISO('1970-01-01T00:00:00.000Z');

  describe('exportDataToOpensearch function', () => {
    const config: ModuleConfiguration = {
      teleinfo: {
        baudRate: 9200,
        dataBits: 7,
        dataExport: {
          settings: {
            opensearch: {
              indexName: 'INDEX',
              instance: 'http://instance:9200',
              user: 'USER',
              password: 'PASS'
            },
          },
          target: 'opensearch',
        },
        developer: {
          mockRefreshRate: 0,
          serialPortMockEnabled: false
        },
        fareDetails: {},
        powerFactor: 0,
        serialDevice: '',
        stopBits: 1,
      },
    };

    beforeEach(() => {
      createOpenSearchClientMock.mockReset();
      (osClientMock.index as jest.Mock).mockReset();

      createOpenSearchClientMock.mockReturnValue(osClientMock);
    });

    it('should do nothing when Opensearch configuration is unavailable', async () => {
      // given-when
      await exportDataToOpensearch({}, {});

      // then
      expect(createOpenSearchClientMock).not.toHaveBeenCalled();
      expect(osClientMock.index).not.toHaveBeenCalled();
    });

    it('should handle debug mode', async () => {
      // given
      const debugConfig: ModuleConfiguration = {
        ...config,
        debug: true,
      }
      const entries: StoreDataEntries = {
        DAY_INDEXES_20240302: [1000, 2000],
      };

      // when-then
      await exportDataToOpensearch(entries, debugConfig);
    });

    it('should send index per-day data to Opensearch node', async () => {
      // given
      const entries: StoreDataEntries = {
        FIRST_DATA_TIMESTAMP: 0,
        DAY_INDEXES_20240302: [1000, 2000],
        MONTH_INDEXES_202403: [3000, 4000],
      };

      // when
      await exportDataToOpensearch(entries, config);

      // then
      expect(createOpenSearchClientMock).toHaveBeenCalledWith({
        indexName: 'INDEX',
        instance: 'http://instance:9200',
        user: 'USER',
        password: 'PASS'
      });
      expect(osClientMock.index).toHaveBeenCalledWith({
        body: {
          date: DOC_DATE,
          indexes: {
            period1: 1000,
            period2: 2000
          },
          options: { fareOption: 'HP/HC', period1Label: 'HC', period2Label: 'HP' }
        },
        id: 'day-20240302',
        index: 'INDEX',
        'refresh': true
      });
    });

    it('should send supplied per-day data to Opensearch node', async () => {
      // given
      const entries: StoreDataEntries = {
        DAY_SUPPLIED_20240302: [500, 1000],
        MONTH_SUPPLIED_202403: [1000, 2000],
      };

      // when
      await exportDataToOpensearch(entries, config);

      // then
      expect(osClientMock.index).toHaveBeenCalledWith({
        body: {
          date: DOC_DATE,
          supplied: {
            period1: 500,
            period2: 1000
          },
          options: { fareOption: 'HP/HC', period1Label: 'HC', period2Label: 'HP' }
        },
        id: 'day-20240302',
        index: 'INDEX',
        'refresh': true
      });
    });

    it('should send costs per-day data to Opensearch node', async () => {
      // given
      const entries: StoreDataEntries = {
        DAY_COSTS_20240302: 3.5,
        MONTH_COSTS_202403: 10,
      };

      // when
      await exportDataToOpensearch(entries, config);

      // then
      expect(osClientMock.index).toHaveBeenCalledWith({
        body: {
          date: DOC_DATE,
          costs: 3.5,
          options: { fareOption: 'HP/HC', period1Label: 'HC', period2Label: 'HP' }
        },
        id: 'day-20240302',
        index: 'INDEX',
        'refresh': true
      });
    });

    it('should send stats per-day data to Opensearch node', async () => {
      // given
      const entries: StoreDataEntries = {
        DAY_STATS_20240302: {
          apparentPower: {
            min: 0,
            max: 1000,
            minTimestamp: 0,
            maxTimestamp: 0,
          },
          instantIntensity: {
            min: 0,
            max: 1,
            minTimestamp: 0,
            maxTimestamp: 0
          },
        },
        MONTH_STATS_202403: {
          apparentPower: {
            min: 0,
            max: 2000,
          },
          instantIntensity: {
            min: 0,
            max: 2,
          },
        }
      };

      // when
      await exportDataToOpensearch(entries, config);

      // then
      expect(osClientMock.index).toHaveBeenCalledWith({
        body: {
          date: DOC_DATE,
          statistics: {
            apparentPower: {
              max: 1000,
              maxDate: new Date(STATS_DATE),
              min: 0,
              minDate: new Date(STATS_DATE),
            },
            instantIntensity: {
              max: 1,
              maxDate: new Date(STATS_DATE),
              min: 0,
              minDate: new Date(STATS_DATE),
            },
          },
          options: { fareOption: 'HP/HC', period1Label: 'HC', period2Label: 'HP' }
        },
        id: 'day-20240302',
        index: 'INDEX',
        'refresh': true
      });
    });
  });
})
