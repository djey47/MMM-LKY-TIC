TODO-FIXME
==========

# TODO
- [front-end] basic/advanced display modes
  - Basic only shows most important info (status bar, current supply, daily costs...)
  - Advanced shows more pages but with auto scroll carroussel-like
  - Configuration: mode (basic default), page persistance time...
- costs: take into account the subscribe fees
  - annual fee to be set in configuration (or monthly?)
  - compute global cost : add all fare period costs + fee / day, fee / month, fee / year, total fee accordingly 
- quick status display with icons/labels
  - [x] connection status to TIC: disconnected (no data or too old data received) or connected
    => does not work for now as the component does not update till new data arrives (see withNotification HOC to trigger the refresh every 5 seconds via setInterval - ? requires a retry count in state ?)
    => useState does not work in a hook - need to write a hook instead, try in template
  - [x] Fare period label, BASE, HC: HC/HP or EJP: NORMAL/PEAK
  - [x] supply status: eco / medium / high / critical
    => Based on overflow power warning (critical) and on current intensity VS subscribed intensity (eco to high)
    => could be enhanced with custom settings based on instant power (thresholds)
  - [] cost trend: extrapolate daily cost and compare with the day before: eco+, steady, higher
    => Backend computation
    => Need indexes from configured hours for more reliability
    => By default, extrapolate current value to the end of the day
- migrate to dart-sass (also update canvas)
  => replace sass @imports with @use
- archive data store per month (see GH issue #1)
- store and display statistics per day:
  - [x] supplied power
  - [ ] min/max/avg power 
  - [ ] min/max/avg intensity
  - [x] store timestamps for min and max values
- display per-year info and stats instead of total
- unit tests for teleinfo processing

# FIXME
- [ ] Computation of estimated prices is not reliable when price per kwh or subscription fee change, as amount are based on delta between initial period indexes and current indexes... => need to freeze costs when any of those items change, amount shold be computed with frozen costs + current costs. Initial indexes must be changed accordingly.
  => Add concept of contract terms?
- [ ] cannot npm install on dev env anymore (WIN-WSL...) due to native modules
- [ ] teleinfo-reader utility does not work anymore because of MM2 interfaces (node_helper and log)
  => needs to be remade without any link to MM2, datastore, advanced stats

# DONE
- [x] Data export to Opensearch dashboards
- store indexes at configured hours for historization
  - [x] Manual data store indexing
  - [x] per-day auto indexing to opensearch
- provide interfaces for stored items
- SIGINT signal sent by PM2 does not seem to execute async stop call
  => data store persist is not called
  => but works with terminal INT (CTRL-C) or electron quit menu command...
  => test sync call and provide sync persist if needed
- provide instance store persist in synchronous mode
- Teleinfo component: remove currencySymbol from props, use context instead
- display daily costs with more precision (2 decimals)
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
