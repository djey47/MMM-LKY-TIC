import { MockBinding } from '@serialport/binding-mock';
import { SerialPortStream } from '@serialport/stream';
import { TeleinfoConfiguration } from '../../../../shared/domain/teleinfo-config';

export function initMockPort(config: TeleinfoConfiguration) {
  const {
    baudRate,
    developer: { mockRefreshRate },
  } = config;

  // Create a port and enable the echo and recording.
  MockBinding.createPort('/dev/ROBOT', { echo: true, record: true });
  const portMock = new SerialPortStream({
    binding: MockBinding,
    path: '/dev/ROBOT',
    baudRate,
  });

  let iterationCount = 1;
  portMock.on('open', () => {
    setInterval(() => {
      const data = generateDatagram(
        360 + iterationCount,
        20000 + iterationCount * 2,
        10000 + iterationCount * 3
      );
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      portMock.port!.emitData(data);
      iterationCount += 1;
    }, mockRefreshRate);
  });

  return portMock;
}

function generateDatagram(pApp: number, hcLHIndex: number, hcHHIndex: number) {
  return `\x02\nADCO 032161613293 <\nOPTARIF HC.. <\nISOUSC 45 ?\nHCHC 00${hcLHIndex} "\nHCHP 00${hcHHIndex} 1\nPTEC HP..  \nIINST 001 X\nADPS 001 X\nIMAX 090 H\nPAPP 00${pApp} *\nHHPHC A ,\nMOTDETAT 000000 B\x03`;
}
