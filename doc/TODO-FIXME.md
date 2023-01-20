TODO-FIXME
==========

# TODO
- Data store: save contents to file
  => At regular interval (1h?)
  => At module stop (MM2 hook? https://docs.magicmirror.builders/development/node-helper.html#stop)
  => Init data store at start with content of saved file
  => file structure: meta and store contents
- unit tests for teleinfo processing
  => Data store: store initial indexes per day
- Per day historization
  => Compute average powers
  => Need persistent storage: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
- Number of kwh supplied for current fare option
  => See with backend data enhancer


# FIXME

# DONE
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
