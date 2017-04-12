const system = require('system');
const page = require('webpage').create();

var args = system.args;

page.onResourceRequested = function (request) {
	// console.log('Request', request);
};

page.onResourceReceived = function (response) {
	console.log(response.url);
};

page.open(args[1], function (status) {
	phantom.exit();
});
