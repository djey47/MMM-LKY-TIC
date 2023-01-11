import { DelimiterParser } from '@serialport/parser-delimiter';
import { SerialPortStream } from '@serialport/stream';
import { SerialPort } from 'serialport';
import { TeleinfoConfiguration } from './domain/teleinfo-config';
import { TeleInfo } from './domain/teleinfo';
import * as SerialMock from './helpers/serial-mock';
import * as groupIndex from './settings/group-index.json';

const CHAR_STX = '\x02';
const CHAR_ETX = '\x03';

/**
 * Teleinfo reader entry point.
 * @param config teleinfo configuration. See module README.
 */
export function start(config: TeleinfoConfiguration) {
  const port = config.developer.serialPortMockEnabled ? SerialMock.initMockPort(config) : initHardwarePort(config);
  configureStream(port);  
}

function initHardwarePort(config: TeleinfoConfiguration) {
  const { baudRate, serialDevice } = config;
  const port = new SerialPort({ path: serialDevice, baudRate }, function (err) {
    if (err) {
      return console.log('Init hardware port failed: ', err.message)
    }
  })

  return port;
}

function configureStream(port: SerialPortStream) {
  const datagramStream = port.pipe(new DelimiterParser({ delimiter: CHAR_ETX }));

  datagramStream.on('data', function (data: Buffer) {
    const newTeleInfo = parseDatagram(data);

    console.log('new Teleinfo:', newTeleInfo);
  });
}

function parseDatagram(data: Buffer): TeleInfo {
  console.log('Data (RAW, TEXT):', data, data.toString());

  const groups = data.toString().split('\n');

  return  groups.reduce((acc: TeleInfo, groupContents) => {
    const [name, value] = groupContents.split(' ');
    console.log('+Group: ', {name, value});

    if (name === CHAR_STX) {
      // As we parse datagrams following ETX (end) control char, ignore start token
      return acc;
    }
    
    const { historical } = groupIndex;
    const teleinfoKeyName = historical[name as keyof typeof historical];
    if (teleinfoKeyName) {
      acc[teleinfoKeyName] = value;
      acc.meta.lastUpdateTimestamp = new Date().getTime();
    } else {
      acc.meta.unresolvedGroups[name] = value;
    }
    return acc;
  }, { meta: { unresolvedGroups: {} }});
}


