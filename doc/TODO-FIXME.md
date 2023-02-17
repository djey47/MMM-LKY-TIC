TODO-FIXME
==========

# TODO
- store indexes at configured hours for historization
- display daily costs with more precision (2 decimals)
- quick status display with icons/labels
  => connection status to TIC: disconnected (no data or too old data received) or connected
  => Fare period label, BASE, HC: HC/HP or EJP: NORMAL/PEAK
  => supply status: eco / medium / high
  => cost trend: extrapolate daily cost and compare with the day before: eco+, steady, higher
- migrate to dart-sass (also update canvas)
  => replace sass @imports with @use
- archive data store per month (see GH issue #1)
- store and display statistics per day:
  - [x] supplied power
  - [ ] min/max/avg power 
- unit tests for teleinfo processing

# FIXME


# DONE
- alert when reaching 80%+ of the maximum supply
  => Retrieve or set the maximum supply // or use the overflow warning field
  => OK / WARN / CRITICAL
  => colors, symbols?
- install font awesome: https://fontawesome.com/v6/docs/web/use-with/react/#contentHeader
- fix unit test failing on CI (Teleinfo.spec.tsx) 
  => mock datefns/format
- update README for features
- display power overuse warning with ADPS field
- per month: store and display supplied power / estimated costs
- Data store: store initial indexes per day
- Number of kwh supplied for current fare option
  => See with backend data enhancer
- display supplied kwh for the day
- Per day historization
  => Compute average powers
  => Need persistent storage: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
- Data store: save contents to file
  => At regular interval (1h?)
  => At module stop (MM2 hook? https://docs.magicmirror.builders/development/node-helper.html#stop)
  => Init data store at start with content of saved file
  => file structure: meta and store contents
- Per day cost
  => Will depend on chosen fare option and indexes
  => store indexes at first data arrival, compare with new indexes
  => Config will tell price per kwh 
- Since start supply cost
- Instant power in watt (compute with ratio)
- use proper units for teleinfo raw data (number, string...)
  => Format them accordingly by client side
- dev mode with auto rebuild
  => only applicable to client part?!
  => experiment in template
  => will then just need F5 in MM2 browser tab
