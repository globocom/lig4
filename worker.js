var exec = require('child_process').exec;
var secs = 360;

setInterval(function() {
	child = exec("make worker", function(error, stdout, stderr) {
		console.log(error, stdout, stderr);
	});
}, secs * 1000);
