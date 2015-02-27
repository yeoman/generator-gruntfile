'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');

var GruntfileGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');

    // Check if package.json or jshint config exist
    // to determine if they should be created later
    if (this.dest.exists('package.json')) {
      this.packageJSON = this.dest.readJSON('package.json');
      this.appname = _.slugify(this.packageJSON.name || this.appname);
      this.version = this.packageJSON.version || this.version;
      this.hasJshint = this.packageJSON.hasOwnProperty('jshintConfig') || this.dest.exists('.jshintrc');
    } else {
      this.hasJshint = this.dest.exists('.jshintrc');
    }

    function prefer(arr, preferred) {
      for (var i = 0; i < preferred.length; ++i) {
        if (arr.indexOf(preferred[i]) !== -1) {
          return preferred[i];
        }
      }
      return preferred[0];
    }

    var dirs = this.dest.expand({ filter: 'isDirectory' }, '*').map(function (d) {
      return d.slice(0, -1);
    });

    this.jquery = this.dest.expand({ filter: 'isFile' }, '**/jquery*.js').length > 0;
    this.libDir = prefer(dirs, ['lib', 'src']);
    this.testDir = prefer(dirs, ['test', 'tests', 'unit', 'spec']);
  },

  prompting: function () {
    var done = this.async();

    if (!this.options['skip-install-message']) {
      this.log(this.yeoman);
      this.log('This template tries to guess file and directory paths, but ' +
               'you will most likely need to edit the generated Gruntfile.js file before ' +
               'running grunt. _If you run grunt after generating the Gruntfile, and ' +
               'it exits with errors, edit the file!_');
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Is the DOM involved in ANY way?',
        value: 'dom',
        checked: true
      }, {
        name: 'Will files be concatenated or minified?',
        value: 'minConcat',
        checked: true
      }]
    }];

    this.prompt(prompts, function (answers) {
      function hasFeature(feat) {
        return answers.features.indexOf(feat) !== -1;
      }

      this.dom = hasFeature('dom');
      this.minConcat = hasFeature('minConcat');
      this.testTask = hasFeature('dom') ? 'qunit' : 'nodeunit';

      if (!this.version) {
          this.version = '0.0.0';
      }

      done();
    }.bind(this));
  },

  configuring: function () {
    this.config.save();
  },

  writing: function () {
    if (!this.packageJSON) {
      this.template('_package.json', 'package.json');
    }
    this.template('_Gruntfile.js', 'Gruntfile.js');
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  }
});

module.exports = GruntfileGenerator;

