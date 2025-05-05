import { dateToISO } from './format';

describe('format helper functions', () => {
  describe('dateToISO function', () => {
    it('should convert date string to ISO format', () => {
      // given
      const dateStr = '20240302';

      // when
      const result = dateToISO(dateStr);
      
      // then
      const expectedISO = '2024-03-02T00:00:00.000Z';
      expect(result).toBe(expectedISO);
    });
  });
});
