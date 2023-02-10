interface GroupIndex {
  /**
   * Historical mode, compatible with Linky and old generation electrical counters
   */
  historical: {
    ADCO: string;
    ADPS: string;
    BASE: string;
    EJPHN: string;
    EJPHPM: string;
    HCHC: string;
    HCHP: string;
    HHPHC: string;
    IINST: string;
    IMAX: string;
    ISOUSC: string;
    MOTDETAT: string;
    OPTARIF: string;
    PAPP: string;
    PEJP: string;
    PTEC: string;
  };
  /**
   * Standard mode, only compatible with Linky counters, is not supported yet
   */
  standard: object;
}
