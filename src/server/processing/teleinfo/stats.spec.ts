import { computeStatistics } from './stats';
import type { TeleInfo } from '../../../shared/domain/teleinfo';

jest.mock('./helpers/instance-store', () => ({
  InstanceStore: {
    getInstance: jest.fn(() => ({
      get: jest.fn(),
      put: jest.fn(),
    })),
  },
}));

describe('teleinfo stats', () => {
  describe('computeStatistics function', () => {
    it('should compute statistics for instant power', () => {
      // given
      const data = {
        apparentPower: 200,
        estimatedPower: 100,
        instantIntensity: 1,
        meta: {},
      } as TeleInfo;

      // when
      const actual = computeStatistics(data);

      // then
      expect(actual.instantPower).toBeDefined();
      expect(actual.instantEstimatedPower).toBeDefined();
      expect(actual.instantIntensity).toBeDefined();
    });

    it('should return undefined for missing values', () => {
      // given
      const data = {
        apparentPower: undefined,
        estimatedPower: undefined,
        instantIntensity: undefined,
        meta: {},
      } as TeleInfo;

      // when
      const actual = computeStatistics(data);

      // then
      expect(actual.instantPower).toBeUndefined();
      expect(actual.instantEstimatedPower).toBeUndefined();
      expect(actual.instantIntensity).toBeUndefined();
    });
  });
});
