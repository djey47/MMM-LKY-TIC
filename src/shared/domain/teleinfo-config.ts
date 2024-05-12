export interface TeleinfoConfiguration {
  baudRate: number;
  dataBits: 5 | 6 | 7 | 8;
  developer: {
    mockRefreshRate: number;
    serialPortMockEnabled: boolean;
  };
  dataExport: {
    target: 'opensearch' | 'none';
    settings: {
      opensearch: OpensearchConfiguration;
    };
  };
  fareDetails: FareDetails;
  powerFactor: number;
  serialDevice: string;
  stopBits: 1 | 2;
}

export interface FareDetails {
  [key: string]: number | undefined;
  basePricePerKwh?: number;
  hcHHPricePerKwh?: number;
  hcLHPricePerKwh?: number;
  ejpNormalPricePerKwh?: number;
  ejpPeakPricePerKwh?: number;
  subscriptionFeePerMonth?: number;
}

export interface OpensearchConfiguration {
  indexName: string;
  instance: string;
  user: string;
  password: string;
};
