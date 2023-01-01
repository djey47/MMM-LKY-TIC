import { SerialPort } from 'serialport';
import { SerialPortStream } from '@serialport/stream';
import { DelimiterParser } from '@serialport/parser-delimiter';
import { TeleInfo } from './domain/teleinfo';
import * as groupIndex from './config/group-index.json';
import * as Config from './helpers/config';
import * as SerialMock from './helpers/serial-mock';

const CHAR_STX = '\x02';
const CHAR_ETX = '\x03';

function initHardwarePort(config: Config.Configuration) {
  const { baudRate, serialDevice } = config;
  const port = new SerialPort({ path: serialDevice, baudRate }, function (err) {
    if (err) {
      return console.log('Init hardware port failed: ', err.message)
    }
  })

  return port;
}

function configureStream(port: SerialPortStream) {
  // @ts-ignore
  const datagramStream = port.pipe(new DelimiterParser({ delimiter: CHAR_ETX }));

  // @ts-ignore
  datagramStream.on('data', function (data: Buffer) {
    const newTeleInfo = parseDatagram(data);

    console.log('new Teleinfo:', newTeleInfo);
    exitNotice();
  });
}

function parseDatagram(data: Buffer): TeleInfo {
  // @ts-ignore
  console.log('Data (RAW, TEXT):', data, data.toString());

  const groups = data.toString().split('\n');

  return  groups.reduce((acc: TeleInfo, groupContents) => {
    const [name, value] = groupContents.split(' ');
    console.log('+Group: ', {name, value});

    if (name === CHAR_STX) {
      // As we parse datagrams following ETX (end) control char, ignore start token
      return acc;
    }
    
    const teleinfoKeyName = groupIndex.historical[name];
    if (teleinfoKeyName) {
      acc[teleinfoKeyName] = value;
      acc.meta.lastUpdateTimestamp = new Date().getTime();
    } else {
      acc.meta.unresolvedGroups[name] = value;
    }
    return acc;
  }, { meta: { unresolvedGroups: {} }});
}

function exitNotice() {
  console.log('CTRL-C to exit');
}

async function main() {
  const config = await Config.read();
  console.log('Loaded configuration:', config);

  const port = config.developer.serialPortMockEnabled ? SerialMock.initMockPort(config) : initHardwarePort(config);
  configureStream(port);

  console.log('Ready!');
  exitNotice();
}

main();
