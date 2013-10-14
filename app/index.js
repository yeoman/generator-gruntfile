'use strict';

var grunt = require('grunt');
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

/**
 * Generator constructor
 *
 * @api public
 */

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
}

/**
 * Inherit from `yeoman.generators.Base`
 */

util.inherits(Generator, yeoman.generators.Base);

/**
 * Prompts for information
 *
 * @api public
 */

Generator.prototype.askFor = function () {
  var self = this;
  var cb = this.async();

  console.log(this.yeoman);
  console.log('This template tries to guess file and directory paths, but ' +
  'you will most likely need to edit the generated Gruntfile.js file before ' +
  'running grunt. _If you run grunt after generating the Gruntfile, and ' +
  'it exits with errors, edit the file!_');

  var prompts = [{
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like?',
    choices: [{
      name: 'Is the DOM involved in ANY way?',
      value: 'dom',
      checked: false
    }, {
      name: 'Will files be concatenated or minified?',
      value: 'minConcat',
      checked: false
    }, {
      name: 'Will you use a package.json file?',
      value: 'packageJSON',
      checked: false
    }]
  }];

  function prefer(arr, preferred) {
    for (var i = 0; i < preferred.length; i++) {
      if (arr.indexOf(preferred[i]) !== -1) {
        return preferred[i];
      }
    }

    return preferred[0];
  }

  var dirs = grunt.file.expand({ filter: 'isDirectory' }, '*').map(function (d) {
    return d.slice(0, -1);
  });

  this.jquery = grunt.file.expand({ filter: 'isFile' }, '**/jquery*.js').length > 0;
  this.libDir = prefer(dirs, ['lib', 'src']);
  this.testDir = prefer(dirs, ['test', 'tests', 'unit', 'spec']);

  this.prompt(prompts, function (answers) {
    var features = answers.features;

    function hasFeature(feat) {
      return features.indexOf(feat) !== -1;
    }

    self.dom = hasFeature('dom');
    self.minConcat = hasFeature('minConcat');
    self.packageJSON = hasFeature('packageJSON');

    self.testTask = hasFeature('dom') ? 'qunit' : 'nodeunit';
    self.fileName = hasFeature('packageJSON') ? '<%= pkg.name %>' : 'FILE_NAME';

    cb();
  });
};

/**
 * Generate the project files
 *
 * @api public
 */

Generator.prototype.projectfiles = function () {
  this.template('gruntfile.js');
};

/**
 * Module exports
 */

module.exports = Generator;
