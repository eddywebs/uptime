/**
 * Pattern matcher plugin
 *
 * Adds the ability to HTTP & HTTPS pollers to test the response body against a pattern
 *
 * Installation
 * ------------
 * This plugin is enabled by default. To disable it, remove its entry 
 * from the `plugins` key of the configuration:
 *
 *   // in config/production.yaml
 *   plugins:
 *     # - ./plugins/patternMatcher
 *
 * Usage
 * -----
 * Add a pattern to http checks in the dashboard UI.
 * Patterns are regexp, for instance '/hello/i'.
 *
 * When Uptime polls a check with a pattern, it tests the pattern against the 
 * response body. If the pattern is not found, the check is considered failed.
 */
var fs   = require('fs');
var ejs  = require('ejs');

var matchPattern = '^/(.*?)/(g?i?m?y?)$';
var template = fs.readFileSync(__dirname + '/views/_detailsEdit.ejs', 'utf8');

exports.initWebApp = function(options) {

  var dashboard = options.dashboard;

	dashboard.on('populateFromDirtyCheck', function(checkDocument, dirtyCheck, type) {
		if (type !== 'http' && type !== 'https') return;
    var expectedResponse = dirtyCheck.expectedResponse;
    console.log('setting the expectedResponse as>>'+expectedResponse);
    // if (match) {
    //   if (match.indexOf('/') !== 0) {
    //     match = '/' + match + '/';
    //   }
    //   var matchParts = match.match(new RegExp(matchPattern));
    //   try {
    //     // check that the regexp doesn't crash
    //     new RegExp(matchParts[1], matchParts[2]);
    //   } catch (e) {
    //     throw new Error('Malformed regular expression ' + dirtyCheck.match);
    //   }
    // }
    checkDocument.setPollerParam('expectedResponse', expectedResponse);
	});

  dashboard.on('checkEdit', function(type, check, partial) {
    if (type !== 'http' && type !== 'https') return;
    partial.push(ejs.render(template, { locals: { check: check } }));
  });

};

exports.initMonitor = function(options) {

  console.log('inside initMonitor for responseMatch');
  options.monitor.on('pollerPolled', function(check, res, details) {
    if (check.type !== 'http' && check.type !== 'https') return;
    var  expectedResponse= check.pollerParams && check.pollerParams.expectedResponse;
    
    if (!expectedResponse) return;
    
    console.log('polling now checking response match>>'+ res.body);
   // var foo= res.body.toStringlocalCompare(expectedResponse);
    console.log(typeof(res.body));

    if(res.body !== expectedResponse) throw new Error('Unexpected respnse >>'+ expectedResponse); 

    // var matchParts = pattern.match(new RegExp(matchPattern));
    // var regexp;
    // try {
    //   // check that the regexp doesn't crash (should only happen if the data was altered in the database)
    //   regexp = new RegExp(matchParts[1], matchParts[2]);
    // } catch (e) {
    //   throw new Error('Malformed pattern in check configuration: ' + pattern);
    // }
    // if (!res.body.match(regexp)) {
    //   throw new Error('Response body does not match pattern ' + pattern);
    // }
    return;
  });

};
