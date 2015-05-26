var child_process = require('child_process'),
	path = require('path');

module.exports = {
	start: function (opts) {
		     return {
			   process: child_process.spawn(process.execPath, [path.normalize(__dirname + '/lib/server.js')], opts),
			   port: process.env.TD_PORT || 3000,
			   root: process.cwd()
		  }
	}
}
