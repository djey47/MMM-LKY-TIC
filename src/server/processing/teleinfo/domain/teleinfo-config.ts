export interface TeleinfoConfiguration {
  baudRate: number;
  developer: {
    mockRefreshRate: number;
    serialPortMockEnabled: boolean;
  },
  serialDevice: string;
}
