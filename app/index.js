'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var grunt = require('grunt');

var GruntfileGenerator = module.exports = function GruntfileGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(GruntfileGenerator, yeoman.generators.NamedBase);


GruntfileGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  console.log(this.yeoman);

  var prompts = [{
    type: 'confirm',
    name: 'dom',
    message: 'Is the DOM involved in ANY way?'
  }, {
    type: 'confirm',
    name: 'minConcat',
    message: 'Will files be concatenated or minified?'
  }, {
    type: 'confirm',
    name: 'packageJSON',
    message: 'Will you have a package.json file?'
  }];

  // Find the first `preferred` item existing in `arr`.
  function prefer(arr, preferred) {
    for (var i = 0; i < preferred.length; i++) {
      if (arr.indexOf(preferred[i]) !== -1) {
        return preferred[i];
      }
    }
    return preferred[0];
  }

  // Guess at some directories, if they exist.
  var dirs = grunt.file.expand({ filter: 'isDirectory' }, '*').map(function (d) { return d.slice(0, -1); });

  this.libDir = prefer(dirs, ['lib', 'src']);
  this.testDir = prefer(dirs, ['test', 'tests', 'unit', 'spec']);
  this.jquery = grunt.file.expand({ filter: 'isFile' }, '**/jquery*.js').length > 0;

  this.prompt(prompts, function (props) {
    this.dom = props.dom;
    this.minConcat = props.minConcat;
    this.packageJSON = props.packageJSON;

    this.testTask = props.dom ? 'qunit' : 'nodeunit';
    this.fileName = props.packageJSON ? '<%%= pkg.name %>' : 'FILE_NAME';

    cb();
  }.bind(this));
};


GruntfileGenerator.prototype.projectfiles = function projectfiles() {
  this.template('Gruntfile.js');
};
