import { computeWholeSuppliedPower, displayDate, displayPriceWithTwoDecimals, getCurrentPeriodLabel, getPeriodLabel } from './displayHelper';
import type { TeleInfo } from '../../shared/domain/teleinfo';

describe('displayHelper functions', () => {
  describe('getPeriodLabel function', () => {
    it('should return the correct label for a given fare option and rank', () => {
      // given-when
      const result = getPeriodLabel('BASE', 0);

      // then
      expect(result).toBe('base');
    });

    it('should return an empty string if chosenFareOption is undefined', () => {
      // given-when
      const result = getPeriodLabel(undefined, 0);

      // then
      expect(result).toBe('');
    });

    it('should return an empty string if the rank is not found in the fare option', () => {
      // given-when
      const result = getPeriodLabel('BASE', 5);

      // then
      expect(result).toBe('');
    });
  });

  describe('getCurrentPeriodLabel function', () => {
    it('should return the correct label for a given fare period', () => {
      // given-when
      const result = getCurrentPeriodLabel('BASE');

      // then
      expect(result).toBe('base');
    });

    it('should return an empty string if currentFarePeriod is undefined', () => {
      // given-when
      const result = getCurrentPeriodLabel(undefined);

      // then
      expect(result).toBe('');
    });

    it('should return an empty string if the fare period is not found', () => {
      // given-when
      const result = getCurrentPeriodLabel('UNKNOWN');

      // then
      expect(result).toBe('');
    });
  });

  describe('displayDate function', () => {
    it('should return the formatted date and time for a given timestamp', () => {
      // given
      const timestamp = new Date('2023-10-01T12:00:00').getTime();

      // when
      const result = displayDate(timestamp);

      // then
      expect(result).toBe('12:00:00, on 2023/10/01');
    });

    it('should return "..." if the timestamp is undefined', () => {
      // given-when
      const result = displayDate(undefined);

      // then
      expect(result).toBe('...');
    });
  });

  describe('displayPriceWithTwoDecimals function', () => {
    it('should return the value rounded to two decimal places', () => {
      // given
      const value = 123.456789;

      // when
      const result = displayPriceWithTwoDecimals(value);

      // then
      expect(result).toBe(123.46);
    });

    it('should return "..." if the value is undefined', () => {
      // given-when
      const result = displayPriceWithTwoDecimals(undefined);

      // then
      expect(result).toBe('...');
    });
  });

  describe('computeWholeSuppliedPower function', () => {
    const defaultData: TeleInfo = {
      suppliedPower: {
        BASE: [1, 2, 3],
        OPTION: [4, 5, 6],
      },
      statistics: {},
    };

    it('should return the sum of supplied power for a given category key', () => {
      // given
      const data: TeleInfo = { ...defaultData };

      // when
      const result = computeWholeSuppliedPower('BASE', data);

      // then
      expect(result).toBe(6);
    });

    it('should return "..." if the data is undefined', () => {
      // given-when
      const result = computeWholeSuppliedPower('BASE', undefined);

      // then
      expect(result).toBe('...');
    });

    it('should return "..." if the supplied power is undefined', () => {
      // given
      const data: TeleInfo = { statistics: {} };

      // when
      const result = computeWholeSuppliedPower('BASE', data);

      // then
      expect(result).toBe('...');
    });

    it('should return "..." if the supplied power for the category key is undefined', () => {
      // given
      const data: TeleInfo = { ...defaultData };

      // when
      const result = computeWholeSuppliedPower('UNKNOWN', data);

      // then
      expect(result).toBe('...');
    });
  });
});
