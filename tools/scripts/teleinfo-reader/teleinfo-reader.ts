import { DelimiterParser } from '@serialport/parser-delimiter';
import { SerialPort } from 'serialport';
import * as Config from './helpers/config';
import * as groupIndex from '../../../src/server/processing/teleinfo/settings/group-index.json';
import { convertTeleinfoRawData } from '../../../src/server/processing/teleinfo/data-converter';

// FIXME similar code stands on server processing side, duplication should be avoided

const CHAR_STX = '\x02';
const CHAR_ETX = '\x03';

function exitNotice() {
  console.log('CTRL-C to exit');
}

function initHardwarePort(config) {
  const { baudRate, serialDevice, dataBits, stopBits } = config;
  const port = new SerialPort(
    { path: serialDevice, baudRate, dataBits, stopBits },
    function (err) {
      if (err) {
        console.error(`**** teleinfo-reader::initHardwarePort: failed, ${err.message}`);
      }
    }
  );

  return port;
}

function parseDatagram(data) {
  console.log(
    `**** teleinfo-reader::parseDatagram: Data (RAW, TEXT): ${data} ${data.toString()}`
  );

  const groups = data.toString().split('\n');

  const teleinfoData = groups.reduce(
    (acc, groupContents) => {
      const [name, rawValue] = groupContents.split(' ');

      console.log(
        `**** teleinfo-reader::parseDatagram: +Group: ${JSON.stringify(
          { name, value: rawValue },
          null,
          2
        )}`
      );

      if (name === CHAR_STX) {
        // As we parse datagrams following ETX (end) control char, ignore start token
        return acc;
      }

      const { historical } = groupIndex;
      const teleinfoKeyName = historical[name as keyof typeof historical];
      if (teleinfoKeyName) {
        acc[teleinfoKeyName] = convertTeleinfoRawData(
          teleinfoKeyName,
          rawValue
        );
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        acc.meta!.lastUpdateTimestamp = new Date().getTime();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        acc.meta!.unresolvedGroups[name] = rawValue;
      }
      return acc;
    },
    {
      meta: { unresolvedGroups: {} },
      statistics: {},
    }
  );

  return teleinfoData;
}

function configureStream(
  port
) {
  const datagramStream = port.pipe(
    new DelimiterParser({ delimiter: CHAR_ETX })
  );

  datagramStream.on('data', function (data: Buffer) {
    const newTeleInfo = parseDatagram(data);

    console.log(
      `***** teleinfo-reader::configureStream: new Teleinfo => ${JSON.stringify(
        newTeleInfo,
        null,
        2
      )}`
    );
  });
}

function startCLI(config) {
  const port = initHardwarePort(config);
  configureStream(port);
}

async function main() {
  const config = await Config.read();

  console.log('Loaded configuration:', config);

  startCLI(config);

  console.log('Ready!');
  exitNotice();
}

main();
