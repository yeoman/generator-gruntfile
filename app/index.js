'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


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
    name: 'min_concat',
    message: 'Will files be concatenated or minified?'
  }, {
    type: 'confirm',
    name: 'package_json',
    message: 'Will you have a package.json file?'
  }];

  this.currentYear = (new Date()).getFullYear();

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
  var dirs = grunt.file.expand({filter: 'isDirectory'}, '*').map(function(d) { return d.slice(0, -1); });

  this.props = {
    lib_dir: prefer(dirs, ['lib', 'src']),
    test_dir: prefer(dirs, ['test', 'tests', 'unit', 'spec']),
    jquery: grunt.file.expand({filter: 'isFile'}, '**/jquery*.js').length > 0
  };

  this.prompt(prompts, function (props) {
    this.props.dom = props.dom;
    this.props.min_concat = props.min_concat;
    this.props.package_json = props.package_json;

    this.props.test_task = props.dom ? 'qunit' : 'nodeunit';
    this.props.file_name = props.package_json ? '<%%= pkg.name %>' : 'FILE_NAME';

    cb();
  }.bind(this));
};


GruntfileGenerator.prototype.projectfiles = function projectfiles() {
  this.template('Gruntfile.js');
};
