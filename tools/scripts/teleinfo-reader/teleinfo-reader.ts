import * as Config from './helpers/config';
import { start } from '../../../src/server/processing/teleinfo/reader';

function exitNotice() {
  console.log('CTRL-C to exit');
}

async function main() {
  const config = await Config.read();
  console.log('Loaded configuration:', config);

  start(config);

  console.log('Ready!');
  exitNotice();
}

main();
