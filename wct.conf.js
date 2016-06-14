// WebComponents test config file
var path = require('path');
var ret = {
  // Test path
  'suites': ['app/test'],
  'plugins': {
    'local' : {
      // browsers to test
      'browsers' : ['chrome']
    }
  },
  'commandTimeout': 600,
  'webserver': {
    'pathMappings': []
  }
};

var mapping = {};
var rootPath = (__dirname).split(path.sep).slice(-1)[0];

mapping['/components/' + rootPath  +
'/app/bower_components'] = 'bower_components';

ret.webserver.pathMappings.push(mapping);

module.exports = ret;