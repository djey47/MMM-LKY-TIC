jest.useFakeTimers();
jest.spyOn(global, 'clearInterval');

jest.mock('./utils/mm2_facades', () => ({
  Log: {
    log: jest.fn(),
  },
  NodeHelper: {},
}));

const mockStartProcessing = jest.fn();
jest.mock('./processing/teleinfo/teleinfo-processor', () => ({
  startProcessing: mockStartProcessing,
}));

const mockStorePersist = jest.fn();
const mockStoreSetConfiguration = jest.fn();
jest.mock('./processing/teleinfo/helpers/instance-store', () => ({
  InstanceStore: ({
    getInstance: () => ({
      persist: mockStorePersist,
    }),
    setConfiguration: mockStoreSetConfiguration,
  }),
}));

import * as impl from './helper_impl';
import { MM2Helper } from './types/mm2';

const nodeHelper = impl as MM2Helper;

describe('MM2 helper implementation', () => {
  describe('start function', () => {
    it('should set started flag to false', () => {
      // given-when
      nodeHelper.start();

      // then
      expect(nodeHelper.started).toBe(false);
    });
  });

  describe('socketNotificationReceived function', () => {
    beforeEach(() => {
      mockStoreSetConfiguration.mockReset();
      mockStartProcessing.mockReset();
    });

    it('should do nothing when notif is not SET_CONFIG', () => {
      // given-when
      nodeHelper.socketNotificationReceived('NOTIF', {});

      // then
      expect(mockStartProcessing).not.toHaveBeenCalled();
    });

    it('should register config when notif is SET_CONFIG', () => {
      // given
      const sendSocketNotificationMock = jest.fn();
      nodeHelper.sendSocketNotification = sendSocketNotificationMock;

      // when
      nodeHelper.socketNotificationReceived('SET_CONFIG', { key1: 'value1' });

      // then
      expect(nodeHelper.config).toEqual({ key1: 'value1' });
      expect(nodeHelper.started).toBe(true);
      expect(mockStoreSetConfiguration).toHaveBeenCalledWith({ key1: 'value1' });
      expect(sendSocketNotificationMock).toHaveBeenCalledWith('INIT');
      expect(mockStartProcessing).toHaveBeenCalledWith(nodeHelper);
    });
  });

  describe('stop function', () => {
    beforeEach(() => {
      mockStorePersist.mockReset();
    });

    it('should stop heartbeat and trigger a last store persist', async () => {
      // given
      nodeHelper.heartbeatTimerId = 90;

      // when
      await nodeHelper.stop();

      // then
      expect(global.clearInterval).toHaveBeenCalledWith(90);
      expect(mockStorePersist).toHaveBeenCalled();
    });
  });
});
