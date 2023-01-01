import { MockBinding } from '@serialport/binding-mock';
import { SerialPortStream } from '@serialport/stream';
import * as Config from './config';

export function initMockPort(config: Config.Configuration) {
  const { baudRate, developer: { mockRefreshRate } } = config;

  // Create a port and enable the echo and recording.
  MockBinding.createPort('/dev/ROBOT', { echo: true, record: true });
  const portMock = new SerialPortStream({ binding: MockBinding, path: '/dev/ROBOT', baudRate })

  let iterationCount = 1;
  // @ts-ignore
  portMock.on('open', () => {
    // @ts-ignore
    setInterval(() => {
      const data = generateDatagram(360 + iterationCount);
      portMock.port.emitData(data);
      iterationCount += 1;
    }, mockRefreshRate);
  });

  return portMock;
}

function generateDatagram(pApp: number) {
  return `\x02\nADCO 032161613293 <\nOPTARIF HC.. <\nISOUSC 45 ?\nHCHC 002940247 "\nHCHP 001481709 1\nPTEC HP..  \nIINST 001 X\nIMAX 090 H\nPAPP 00${pApp} *\nHHPHC A ,\nMOTDETAT 000000 B\x03`
}
