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
  fares: FarePeriod[];
  powerFactor: number;
  serialDevice: string;
  stopBits: 1 | 2;
}

export interface FarePeriod {
  startDate: string;
  endDate?: string; 
  details: FareDetails;
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
