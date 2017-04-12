const fs = require('fs-extra');
const fs2 = require('fs.extra');
const Path = require('path');
const BASE_PATH = require('app-root-path').path;
const request = require('request');
const Url = require('url');
const exec = require('child_process').exec;
const compress = require('file-compress');

module.exports = {

	evaluate: function (urlPath, overwrite = true, archive = false, method = 'GET', port = 80, headers = {}) {

		function download (uri, filename, overwrite = true, onsuccess = function () {}, onerror = function () {}){
		    request.head(uri, function (err, res, body){
			    var contentType = res.headers['content-type'];
			    var contentLength = res.headers['content-length'];
			    if (overwrite || !fs.existsSync(path)) {
			    	fs.ensureFileSync(filename);
				    request(uri).pipe(fs.createWriteStream(filename)).on('close', function () {
				    	onsuccess(uri, contentType, contentLength);
				    });
				}
		    });
		};

		const logFile = Path.join(BASE_PATH, 'logs', 'web-crawler', new Date().getTime() + '.log');

		exec('phantomjs ' + Path.join(BASE_PATH, 'module', 'crawl.js') + ' ' + urlPath, function (err, stdout, stderr) {
			var urls = stdout.split(/[\r\n]+/);
			urls = urls.filter(function (val, index) {
				return urls.indexOf(val) == index;
			});
			var promises = [];
			urls.forEach(function (url) {
				if (url) {
					var promise = new Promise(function (resolve, reject) {
						var path = Url.parse(url);
						path = Path.join(BASE_PATH, 'web-crawler-statics', path.pathname);
						download(url, path, overwrite, function (uri, contentType, contentLength) {
							fs.ensureFileSync(logFile);
							fs.appendFileSync(logFile, contentType + '\t|\t' + contentLength + '\t|\t' + url + '\r\n');
							resolve(path);
							console.log(path);
						});
					});
					promises.push(promise);

				}
			});
			if (archive) {
				Promise.all(promises).then(function () {
					compress.archive('/config/compress.conf.js');
					console.log('done');
				});
			} else {
				console.log('done');
			}
		});
	},

};
