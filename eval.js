var vm = require('vm')

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
// Only content is required
module.exports = function (content, filename, scope, noGlobals) {
	if (typeof filename === 'object') {
		noGlobals = scope
		scope = filename
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
  sandbox.require = requireLike(module.parent.filename)
  sandbox.global = sandbox

  // Evalutate the content with the given scope
  vm.createScript(content, '')
    .runInNewContext(sandbox)

  return sandbox.module.exports
}
