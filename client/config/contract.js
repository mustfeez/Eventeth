const networks = require('../../build/contracts/Hangup.json').networks

//var keys = Object.keys(networks)
//var config = networks[keys[keys.length - 1]]

var config = networks[42] // kovan

module.exports = {
  Hangup: config
}
