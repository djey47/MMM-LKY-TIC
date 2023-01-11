# MMM-LKY-TIC

[ ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://choosealicense.com/licenses/mit)
[![Codeship Status for djey47/MMM-LKY-TIC](https://app.codeship.com/projects/27c90cc5-d5e1-4956-af95-ea1154fffda4/status?branch=master)](https://app.codeship.com/projects/462252)

MagicMirror2 module to display info about home power supply.

Uses [MMM-React-Canvas-ts](https://github.com/djey47/MMM-React-Canvas-ts) as bootstrapper.

## Utilities

### teleinfo-reader
Small CLI program to diagnose reading of teleinfo data on serial input: `npm run tool:teleinfo-reader`

Configuration is set via `tools/scripts/teleinfo-reader/config/teleinfo-reader.json` file:

```json
{
  "baudRate": 1200,
  "developer": {
    "serialPortMockEnabled": false,
    "mockRefreshRate": 2500
  },
  "serialDevice": "/dev/ttyAMA0"
}
```

- `baudRate`: transfer speed for serial link
- `developer`: advanced settings
  - `serialPortMockEnabled`: enables (true) or disables (false) serial port emulation
  - `mockRefreshRate`: interval in ms for the emulator to receive mock teleinfo
- `serialDevice`: device name to capture teleinfo data from.  

