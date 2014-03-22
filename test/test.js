/*global beforeEach, describe, it */
'use strict';

var helpers = require('yeoman-generator').test;
var path = require('path');

describe('gruntfile:app', function () {
  var generator;

  beforeEach(function (cb) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function () {
      var deps = ['../../app'];
      generator = helpers.createGenerator('gruntfile:app', deps);
      cb();
    });
  });

  it('creates expected files', function (cb) {
    var expected = ['gruntfile.js'];

    helpers.mockPrompt(generator, {
      features: [
        'dom',
        'minConcat'
      ]
    });

    generator.run({}, function () {
      helpers.assertFile(expected);
      cb();
    });
  });
});
