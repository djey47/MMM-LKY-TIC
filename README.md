# MMM-LKY-TIC

[ ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://choosealicense.com/licenses/mit)
![Build status](https://github.com/djey47/MMM-LKY-TIC/actions/workflows/ci.yml/badge.svg?branch=main&event=push)

MagicMirror2 module to display info about home power supply (previous generation and Linky(tm) devices providing data via 'teleinfo/TIC' serial output). 

*For now only historical data mode, single-phased settlement, is handled.*

## Features

### Uses latest MMM-React-Canvas-ts bootstrapper:
See [here](https://github.com/djey47/MMM-React-Canvas-ts) for technical details

### Provides quick supply status via icons
```
-------------
(L)  (S)  (F)
-------------
```
- **L** for Link state: a plug symbol indicates link status between counter and the module:
  - With bolt, green => data was received less than 5 seconds ago
  - With exclamation mark, yellow => data was received less than 10 seconds ago
  - With exclamation mark, orange => data was received less than 30 seconds ago
  - With exclamation mark, red, blinking => data was received more than 30 seconds ago
  - With exclamation mark, red => no data received from the start.
- **S** for Supply state: indicates current electrical consumption:
  - Question mark: unable to determine supply state
  - Green leaf: current intensity is less than third of subscribed intensity
  - Yellow bolt: current is less than two thirds of subscribed
  - Orange bolt: current is less than five sixths of subscribed
  - Red bolt: current is more than five sixths of subscribed
  - Red bolt, blinking: power overflow has been detected over subscribed.
- **F** for Fare period: displays current fare period, according to chosen fare option and time of the day.

### Displays instant data

```
Instant power: 637VA/[~511W]
Min (today/month/overall): 220/210/200VA
Max: 650/2500/3554VA
```
- apparent power in VA, and estimate in Watt (depending on your own power factor). Power factor value can be set via the teleinfo configuration, see corresponding section below
- daily/monthly/overall statistics:
  - minimum value
  - maximum value
---
```
                             Intensity: 1A
                               Overuse: 3A
```
- current intensity in Ampere
- when apparent power exceeds subscribed value, a warning appears with the current intensity overflow in Ampere.


### Displays daily, monthly, total electrical furniture and costs

```
Supplied (today/month/total): 475/1000/5000wh
BASE: 475/1000/5000wh
---------------------------------------------
Costs (today/month/total): ~3/8/35€
---------------------------------------------
```

- Supplied energy is detailed according to the chosen fare option (provided by Teleinfo data: ``BASE``, ``HC``, ``EJP``)
- Estimated costs are computed in respect to current fare option and configured fare details (see configuration section below). Please note they don't include subscription and extra furniture costs.

## Install

0. Make sure node v18.12.1 or newer is installed
1. Clone repository
2. Run `npm install` inside repository folder
3. Run npm `run build:module` (development) or `npm run build:module-prod` (optimized)
4. Check that `MMM-LKY-TIC.js`, `styles.css` and `node_helper.js` files have been created into current folder
5. Back to MagicMirror folder, create symbolic link from /modules/ subdirectory, to module repository directory: e.g `ln -s ~/dev/MMM-LKY-TIC/`
6. Add the module to MagicMirror config and customize it according to your needs (see below).

## Configuration

### Main
```json
{
  "currencySymbol": "€",
  "debug": false,
  "teleinfo": { ... }
}
```

- `currencySymbol`: defines the symbol to be used for money (e.g cost)
- `debug`: enables (true) or disables (false) additional log messages for development or troubleshooting
- `teleinfo`: see below.

### Teleinfo section

*Provided `fareDetails` and `powerFactor` values depicted below may not be realistic and need to be adjusted to your particular case.*

```json
{
  "baudRate": 1200,
  "dataBits": 7,
  "developer": {
    "serialPortMockEnabled": false,
    "mockRefreshRate": 2500
  },
  "fareDetails": {
    "basePricePerKwh": 0.7,
    "ejpNormalPricePerKwh": 0.5,
    "ejpPeakPricePerKwh": 1,
    "hcLHPricePerKwh": 0.6,
    "hcHHPricePerKwh": 0.8
  },
  "powerFactor": 0.8,
  "serialDevice": "/dev/ttyAMA0",
  "stopBits": 1
}
```

- `baudRate`: transfer speed for serial link
- `dataBits` and `stopBits`: data encoding in bits number from the serial link
- `developer`: advanced settings
  - `serialPortMockEnabled`: enables (true) or disables (false) serial port emulation
  - `mockRefreshRate`: interval in ms for the emulator to produce mock teleinfo
- `fareDetails`: price per supplied Kwh, depending on chosen fare option
  - `basePricePerKwh`: for the subscribed BASE option
  - `ejpNormalPricePerKwh` and `ejpPeakPricePerKwh`: for the subscribed EJP option
  - `hcLHPricePerKwh` and `hcHHPricePerKwh`: for the subscribed HC option
- `powerFactor`: allows estimating instant power in watts (value will depend on your electrical settlement, see excellent [article](https://www.eaton.com/us/en-us/products/backup-power-ups-surge-it-power-distribution/backup-power-ups/va-versus-watts--eaton.html))
- `serialDevice`: device name to capture teleinfo data from.  

## Development

See [template documentation](https://github.com/djey47/MMM-React-Canvas-ts#developing-your-own-module) for more details.

## Utilities

### teleinfo-reader
Small CLI program to diagnose reading of teleinfo data on serial input: `npm run tool:teleinfo-reader`

Configuration is set via `tools/scripts/teleinfo-reader/config/teleinfo-reader.json` file; see 'Teleinfo section' above.

## MISC

## Credits

Huge thanks to Charles, creator of the PITInfo module for Raspberry PI - great piece of hardware!

- [His blog](https://hallard.me/author/hallard/)
- [Support forum](https://community.ch2i.eu/)
