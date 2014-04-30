/*global beforeEach, describe, it */
'use strict';

var file = require('yeoman-generator').file;
var helpers = require('yeoman-generator').test;
var path = require('path');

describe('gruntfile:app empty project', function () {
  var generator;

  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
      }
      generator = helpers.createGenerator('gruntfile:app', ['../../app']);
      generator.options['skip-install'] = true;
      generator.options['skip-install-message'] = true;
      done();
    });
  });

  it('creates expected files', function (done) {
    var expected = ['Gruntfile.js', 'package.json'];

    helpers.mockPrompt(generator, {
      features: [
        'dom',
        'minConcat'
      ]
    });

    generator.run({}, function () {
      helpers.assertFile(expected);
      helpers.assertFileContent('./package.json', /"version": "0.0.0"/);
      done();
    });
  });
});

describe('gruntfile:app with existing package.json', function () {
  var generator;

  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
      }
      file.write('package.json', '{"jshintConfig":{}, "version": "0.1.0"}');
      generator = helpers.createGenerator('gruntfile:app', ['../../app']);
      generator.options['skip-install-message'] = true;
      generator.options['skip-install'] = true;
      done();
    });
  });

  it('creates expected files', function (done) {
    var expected = ['Gruntfile.js', 'package.json'];

    helpers.mockPrompt(generator, {
      features: [
        'dom',
        'minConcat'
      ]
    });

    generator.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });

  it('does not replace existing package.json', function (done) {
    helpers.mockPrompt(generator, {
      features: [
        'dom',
        'minConcat'
      ]
    });

    generator.run({}, function () {
      helpers.assertFileContent('./package.json', /jshintConfig/);
      helpers.assertFileContent('./package.json', /"version": "0.1.0"/);
      done();
    });
  });

  it('does not conflict with jshintConfig property', function (done) {
    helpers.mockPrompt(generator, {
      features: [
        'dom',
        'minConcat'
      ]
    });

    generator.run({}, function () {
      helpers.assertNoFileContent('./Gruntfile.js', /jshint: {/);
      done();
    });
  });
});

