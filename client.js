var https = require("https");
var http = require("http");

function get(url, cb) {
	var protocolPckg = url.match(/https/) ? https : http;
	var req = protocolPckg.get(url, function (res) {
		console.log("Processing ", url);
		var content = "";
		res.setEncoding("utf-8");

		res.on("data", function (data) {
			content += data;
		});

		res.on("end", function () {
			cb(null, JSON.parse(content));
		});
	});
	req.on("error", function (e) {
		console.error(e);
		cb(e);
	});
}

module.exports.get = get;