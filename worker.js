var exec = require('child_process').exec;

setInterval(function() {
	child = exec("make worker", function(error, stdout, stderr) {
		console.log(error, stdout, stderr);
	});
}, 60000);