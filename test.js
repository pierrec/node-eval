var assert = require('assert')

var _eval = require('./eval')
var res

res = _eval('var x = 123; exports.x = x')
assert.deepEqual( res, { x: 123 } )

res = _eval('module.exports = function () { return 123 }')
assert.deepEqual( res(), 123 )

res = _eval('module.exports = require("events")')
assert.deepEqual( res, require('events') )

res = _eval('exports.x = process')
assert.deepEqual( res.x, process )

console.log('All tests passed')