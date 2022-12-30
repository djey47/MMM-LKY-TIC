import { SerialPortStream } from '@serialport/stream';
import { MockBinding } from '@serialport/binding-mock';
import { DelimiterParser } from '@serialport/parser-delimiter';
import { TeleInfo } from './domain/teleinfo';
import * as groupIndex from './config/group-index.json';

function initMockPort() {
  // Create a port and enable the echo and recording.
  MockBinding.createPort('/dev/ROBOT', { echo: true, record: true });
  const portMock = new SerialPortStream({ binding: MockBinding, path: '/dev/ROBOT', baudRate: 1200 })

  let iterationCount = 1;
  // @ts-ignore
  portMock.on('open', () => {
    // @ts-ignore
    setInterval(() => {
      const data = generateDatagram(360 + iterationCount);
      portMock.port.emitData(data);
      iterationCount += 1;
    }, 2500);
  });

  return portMock;
}

function generateDatagram(pApp: number) {
  return `\x02\nADCO 032161613293 <\nOPTARIF HC.. <\nISOUSC 45 ?\nHCHC 002940247 "\nHCHP 001481709 1\nPTEC HP..  \nIINST 001 X\nIMAX 090 H\nPAPP 00${pApp} *\nHHPHC A ,\nMOTDETAT 000000 B\x03`
}

function configureStream(port: SerialPortStream, teleinfo: TeleInfo) {
  // @ts-ignore
  const datagramStream = port.pipe(new DelimiterParser({ delimiter: '\x03' }));

  // @ts-ignore
  datagramStream.on('data', function (data: Buffer) {
    // @ts-ignore
    console.log('Data:', data, data.toString());
    const newTeleInfo = parseDatagram(data);

    console.log('new Teleinfo:', newTeleInfo);
  });
}

function parseDatagram(data: Buffer): TeleInfo {
  const groups = data.toString().split('\n');

  return  groups.reduce((acc: TeleInfo, groupContents) => {
    const groupItems = groupContents.split(' ');
    const [name, value] = groupItems;
    console.log('group: ', {name, value});

    if (name === '\x02') {
      // Ignore STX control char
      return acc;
    }
    
    const teleinfoKeyName = groupIndex.historical[name];
    if (teleinfoKeyName) {
      acc[teleinfoKeyName] = value;
    } else {
      acc.unresolvedGroups[name] = value;
    }

    return acc;
  }, { unresolvedGroups: {} });
}

const port = initMockPort();

const teleinfo: TeleInfo = {
  unresolvedGroups: {},
};

configureStream(port, teleinfo);






