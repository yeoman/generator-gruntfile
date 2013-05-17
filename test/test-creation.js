/*global describe, beforeEach, it*/
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;


describe('gruntfile generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('gruntfile:app', [
        '../../app'
      ]);
      this.app.options['skip-install'] = true;
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = ['Gruntfile.js'];

    helpers.mockPrompt(this.app, {
      'dom': 'Y',
      'min_concat': 'Y',
      'package_json': 'Y'
    });

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
