#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var util = require('util');
var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
//var HTMLFILE_DEFAULT = "index.html";
var HTMLFILE_DEFAULT = "";
var URL_DEFAULT = "";
var CHECKSFILE_DEFAULT = "checks.json";

var sampleurl = function(url) {
    console.log("fetching url format");
    return util.format(
	//'http://evening-dawn-5945.herokuapp.com/'
	url
        );
};

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertUrlExists = function(inurl) {
    var instr = inurl.toString();
    console.log("%s is the url given.", instr);
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var cheerioUrl = function(htmlStr) {
    return cheerio.load(htmlStr);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    console.log("checkHtmlFile function being executed");
    $ = cheerioHtmlFile(htmlfile);
    //console.log($);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	//console.log('checki balaji:' + $(checks[ii]));
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var response2console = function(result) {
    console.log("eureka...");

};

var checkUrl = function(url, checksfile) {
    console.log("checkUrl function being executed");
    var apiurl = sampleurl(url);
    //var urlRet = rest.get(apiurl).on('complete', response2console);
    rest.get(apiurl).on('complete', function(result) {
	if (result instanceof Error) {
	    util.puts('Error: ' + result.message);
	    //this.retry(5000); // try again after 5 sec
	} else {
	    console.log("getting url result...");
	    //util.puts(result);
	}
	//console.log(checksfile);
	$ = cheerioUrl(result);
	//console.log($);
	var checks = loadChecks(checksfile).sort();
	//console.log(checks);
	var out = {};
	for(var ii in checks) {
	    //console.log('check:' + $(checks[ii]));
            var present = $(checks[ii]).length > 0;
            out[checks[ii]] = present;
	}
	console.log("out mine:");
	console.log(out);
	console.log("out mine END:");
	var outJson = JSON.stringify(out, null, 4);
	console.log('outJson:' + outJson);
	//return out;
    });
    //console.log('urlRet:' + urlRet);
    //return urlRet;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-f, --file <file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'url to index.html', clone(assertUrlExists), URL_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .parse(process.argv);
    
    var checkJson = "";
    if (program.file) {
	checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log('outJson:' + outJson);
    } else if (program.url) {
	console.log("program.url...");
	checkJson = checkUrl(program.url, program.checks);
	console.log('checkJson:' + checkJson);
    }
    //var outJson = JSON.stringify(checkJson, null, 4);
    //console.log('outJson:' + outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
