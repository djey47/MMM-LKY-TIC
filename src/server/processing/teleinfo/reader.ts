/**
 * Reads Teleinfo data from serial port as per configuration
 */

import { DelimiterParser } from '@serialport/parser-delimiter';
import { SerialPortStream } from '@serialport/stream';
import { SerialPort } from 'serialport';
import { convertTeleinfoRawData } from './data-converter';
import { TeleinfoConfiguration } from '../../../shared/domain/teleinfo-config';
import { TeleInfo } from '../../../shared/domain/teleinfo';
import * as SerialMock from './helpers/serial-mock';
import * as groupIndex from './settings/group-index.json';
import { MM2Helper } from '../../types/mm2';
import { computeAdditionalTeleinfoData } from './data-enhancer';

const CHAR_STX = '\x02';
const CHAR_ETX = '\x03';

/**
 * Teleinfo reader entry point.
 * @param config teleinfo configuration. See module README.
 * @param mm2Helper MM2 helper instance
 */
export function start(config: TeleinfoConfiguration, mm2Helper?: MM2Helper) {
  const port = config.developer.serialPortMockEnabled ? SerialMock.initMockPort(config) : initHardwarePort(config);
  configureStream(port, config, mm2Helper);  
}

function initHardwarePort(config: TeleinfoConfiguration) {
  const { baudRate, serialDevice, dataBits, stopBits } = config;
  const port = new SerialPort({ path: serialDevice, baudRate, dataBits, stopBits }, function (err) {
    if (err) {
      return console.log('Init hardware port failed: ', err.message)
    }
  })

  return port;
}

function configureStream(port: SerialPortStream, config: TeleinfoConfiguration, mm2Helper?: MM2Helper) {
  const datagramStream = port.pipe(new DelimiterParser({ delimiter: CHAR_ETX }));

  datagramStream.on('data', function (data: Buffer) {
    const newTeleInfo = parseDatagram(data, config);

    console.log('new Teleinfo:', newTeleInfo);

    if (mm2Helper?.sendSocketNotification) {
      mm2Helper.sendSocketNotification('TELEINFO', newTeleInfo);
    }
  });
}

function parseDatagram(data: Buffer, config: TeleinfoConfiguration): TeleInfo {
  console.log('Data (RAW, TEXT):', data, data.toString());

  const groups = data.toString().split('\n');

  const teleinfoData = groups.reduce((acc: TeleInfo, groupContents) => {
    const [name, rawValue] = groupContents.split(' ');
    console.log('+Group: ', {name, value: rawValue});

    if (name === CHAR_STX) {
      // As we parse datagrams following ETX (end) control char, ignore start token
      return acc;
    }
    
    const { historical } = groupIndex;
    const teleinfoKeyName = historical[name as keyof typeof historical];
    if (teleinfoKeyName) {
      acc[teleinfoKeyName] = convertTeleinfoRawData(teleinfoKeyName, rawValue);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      acc.meta!.lastUpdateTimestamp = new Date().getTime();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      acc.meta!.unresolvedGroups[name] = rawValue;
    }
    return acc;
  }, { meta: { unresolvedGroups: {} }});

  return computeAdditionalTeleinfoData(teleinfoData, config);
}
