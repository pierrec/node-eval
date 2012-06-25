var vm = require('vm')
var isBuffer = Buffer.isBuffer

var requireLike = require('require-like')

function merge (a, b) {
	if (!a || !b) return a

	var keys = Object.keys(b)
  for (var k, i = 0, n = keys.length; i < n; i++) {
  	k = keys[i]
  	a[k] = b[k]
  }

  return a
}

// Return the exports/module.exports variable set in the content
// content (String|VmScript): required
module.exports = function (content, filename, scope, noGlobals) {
	if (typeof filename === 'object') {
		noGlobals = scope
		scope = filename
    filename = null
	}

	// Expose standard Node globals
  var sandbox = {}
  var exports = {}

  if (!noGlobals)
    merge(sandbox, global)

  if (typeof scope === 'object')
  	merge(sandbox, scope)

  sandbox.exports = exports
  sandbox.module = { exports: exports }
  sandbox.require = requireLike(filename || module.parent.filename)
  sandbox.global = sandbox

  if ( isBuffer(content) )
    content = content.toString()
  
  // Evalutate the content with the given scope
  if (typeof content === 'string')
    vm.createScript( content.replace(/^\#\!.*/, ''), '' )
      .runInNewContext(sandbox)
  else
    content.runInNewContext(sandbox)

  return sandbox.module.exports
}
