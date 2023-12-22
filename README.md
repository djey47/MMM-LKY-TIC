# MMM-LKY-TIC

[ ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://choosealicense.com/licenses/mit)
![Build status](https://github.com/djey47/MMM-LKY-TIC/actions/workflows/ci.yml/badge.svg?branch=main&event=push)

MagicMirror2 module to display info about home power supply (previous generation and Linky(tm) devices providing data via 'teleinfo/TIC' serial output). 

*For now only historical data mode, single-phased settlement, is handled.*

Module is currently under development, working for use case above.

![Sample 1](https://github.com/djey47/MMM-LKY-TIC/blob/main/doc/shots/Sample1.png?raw=true)

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
                637VA~511W
Min (d/m/y/o): 220/210/200/200VA
Max: 650/2500/3000/3554VA
```
- apparent power in VA, and estimate in Watt (depending on your own power factor). Power factor value can be set via the teleinfo configuration, see corresponding section below
- daily/monthly/yearly/overall statistics:
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
Supplied (d/m/y/t): 475/1000/2500/5000wh
                        BASE: 475/1000/1500/5000wh
---------------------------------------------
Costs (d/m/y/t): ~3/8/25/35€
---------------------------------------------
```

Per current day/month/year and total:

- Supplied energy is detailed according to the chosen fare option (provided by Teleinfo data: ``BASE``, ``HC``, ``EJP``)
- Estimated costs are computed in respect to current fare option and configured fare details (see configuration section below). Please note they don't include subscription and extra furniture costs.


### Exports local data to Opensearch index

More info about [Opensearch](https://opensearch.org/docs/latest/). This features requires a fully working  Opensearch node + Opensearch dashboards stack (using Docker containers is supported and recommended). 

![Opensearch 1](https://github.com/djey47/MMM-LKY-TIC/blob/main/doc/shots/Opensearch1.png?raw=true)

![Opensearch 2](https://github.com/djey47/MMM-LKY-TIC/blob/main/doc/shots/Opensearch2.png?raw=true)


When enabled (see *Configuration -> Teleinfo* section below), collected data is exported to the Opensearch index of your choice. Using this, you'll be able to display data in Opensearch dashboards (see above screenshot).

Examples of index mapping can be found here: `data-export/opensearch/mappings`.

**Notes:**

- For now, only per-day data is exported
- Export is processed at following events:
  - Start of current MagicMirror module
  - When MagicMirror and this module are running, and a day change is detected, so at 12 a.m.
- Make sure the Opensearch instance is accessible from you MagicMirror device, and ready to receive data; as no immediate retry is attempted on failure. The next export occurrence will be either the day after, or if you decide to restart MagicMirror 
- The index might not exist already, it will be created when necessary
- Similar feature is also available on-demand, within command line tools, not depending on MagicMirror. See *Utilities* section below for details. Please also note it may not be updated in the future!


## Install

### Prerequisites
1. Is your device able to access/read the serial port at all? Some utilities in dedicated section below may help you
2. Make sure node v18.12.1 or newer is installed

### Install note

Since this module relies on `serialport` npm dependency which uses native modules, the `@serialport/bindings-cpp` electron bindings have to be added and built *from module directory*. The `postinstall` npm script should set everything up for you.

### Installing this module
1. Clone repository into location of your choice (may be MagicMirror /modules/ subdirectory)
2. Run `npm install` inside repository folder
3. Check that `MMM-LKY-TIC.js`, `styles.css` and `node_helper.js` files have been created into current folder
4. (If external location chosen at step 1) Back to MagicMirror folder, create symbolic link from /modules/MMM-LKY-TIC/ subdirectory, to module repository directory: e.g `ln -s ~/dev/MMM-LKY-TIC/`
5. Add the module to MagicMirror config and customize it according to your needs (see below).

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
  "dataExport": {
    "target": "opensearch",
    "settings": {
      "opensearch": {
        "index-name": "my-lky-per-day-index",
        "instance": "https://my-nas:9200",
        "user": "os-user",
        "password": "os-password"
      }
    }
  }
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
- `dataExport`: provides configuration for automatic data export (not mandatory)
  - `target`: system to export to
  - `settings`: per-system configuration
    - `opensearch`
      - `indexName`: Opensearch index to send data documents to
      - `instance`: URL of ready-to-use Opensearch instance
      - `user` and `password`: instance credentials 
- `developer`: advanced settings
  - `serialPortMockEnabled`: enables (true) or disables (false) serial port emulation
  - `mockRefreshRate`: interval in ms for the emulator to produce mock teleinfo
- `fareDetails`: price per supplied Kwh, depending on chosen fare option
  - `basePricePerKwh`: for the subscribed BASE option
  - `ejpNormalPricePerKwh` and `ejpPeakPricePerKwh`: for the subscribed EJP option
  - `hcLHPricePerKwh` and `hcHHPricePerKwh`: for the subscribed HC option
- `powerFactor`: allows estimating instant power in watts (value will depend on your electrical settlement, see excellent [article](https://www.eaton.com/us/en-us/products/backup-power-ups-surge-it-power-distribution/backup-power-ups/va-versus-watts--eaton.html))
- `serialDevice`: device name to capture teleinfo data from.  

## Logs

Module output can be rather verbose, especially when debug mode is enabled. To avoid running out of storage space quickly if you're controlling MagicMiror with tools such as PM2, it is highly recommended to add log file rotation mechanism!

## Development

See [template documentation](https://github.com/djey47/MMM-React-Canvas-ts#developing-your-own-module) for more details.

## Utilities

### teleinfo-reader
Small CLI program to diagnose reading of teleinfo data on serial input: `npm run tool:teleinfo-reader`.

Configuration is set via `tools/scripts/teleinfo-reader/config/teleinfo-reader.json` file; see 'Teleinfo section' above.

### opensearch-data-export
This script will push info from the persisted datastore to an opensearch index: `npm run tool:opensearch-data-export <data store file> <index name>`.

- `data store file`: path to the data store JSON file
- `index name`: index name to use on opensearch instance

Configuration is set via `tools/scripts/opensearch-data-export/config/opensearch-data-export.json`:

```json
{
  "opensearchInstance": "https://my-nas:9200",
  "user": "os-user",
  "password": "os-password"  
}
```

- `opensearchInstance`: URL of ready-to-use Opensearch instance
- `user` and `password`: instance credentials. 


### Diagnostics with picocom
It's also possible to capture raw data on serial input, using `picocom` command line tool: https://linux.die.net/man/8/picocom

Make sure it's installed via your distribution's packet manager, then:

`sudo picocom -b 1200 -d 7 -p e -f n /dev/ttyAMA0`

with (assuming teleinfo data is on *historical* mode):
  
- -b = 1200 (bauds rate)
- -d = 7 (databits) 
- -p = e (even parity)
- -f = n (no flow control)
- by default, stop bit count is set to 1.

For people looking for alternatives, `minicom` should also work with equivalent settings.

## Troubleshooting

### No serial data seems to be received...
...whereas the hardware module LED is blinking!

Sometimes (might happen after a device reboot), the serial device requires reinitialization. To do this:
1. stop MagicMirror
2. use `picocom` tool command above
3. check raw data is correctly displayed
4. exit picocom (`CTRL-A` keys by default)
5. finally start MagicMirror. 

## Credits

Huge thanks to Charles, creator of the PITInfo module for Raspberry PI - great piece of hardware!

- [His blog](https://hallard.me/author/hallard/)
- [Support forum](https://community.ch2i.eu/)
