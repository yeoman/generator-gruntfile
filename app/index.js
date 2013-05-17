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
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n' +
  '\n';

  console.log(welcome);

  var prompts = [
  {
    name: 'dom',
    'message': 'Is the DOM involved in ANY way?',
    'default': 'Y/n',
    'warning': 'Yes: QUnit unit tests + JSHint "browser" globals. No: Nodeunit unit tests.'
  }, {
    name: 'min_concat',
    'message': 'Will files be concatenated or minified?',
    'default': 'Y/n',
    'warning': 'Yes: min + concat tasks. No: nothing to see here.'
  }, {
    name: 'package_json',
    'message': 'Will you have a package.json file?',
    'default': 'Y/n',
    'warning': 'This changes how filenames are determined and banners are generated.'
  }];

  var nameToMessage = function (name) {
    return name.split('_').map(
      function (x) { return this._.capitalize(x); }.bind(this)
    ).join(' ') + ':';
  }.bind(this);

  // Generate prompt messages if only the name is defined.
  prompts.map(function (entry) {
    if (entry.message === undefined) {
      entry.message = nameToMessage(entry.name);
    }
    return entry;
  }.bind(this));

  this.currentYear = (new Date()).getFullYear();

  props.dom = /y/i.test(props.dom);
  props.min_concat = /y/i.test(props.min_concat);
  props.package_json = /y/i.test(props.package_json);
  props.test_task = props.dom ? 'qunit' : 'nodeunit';
  props.file_name = props.package_json ? '<%%= pkg.name %>' : 'FILE_NAME';

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
  props.lib_dir = prefer(dirs, ['lib', 'src']);
  props.test_dir = prefer(dirs, ['test', 'tests', 'unit', 'spec']);

  // Maybe this should be extended to support more libraries. Patches welcome!
  props.jquery = grunt.file.expand({filter: 'isFile'}, '**/jquery*.js').length > 0;

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.props = props;
    cb();
  }.bind(this));
};


GruntfileGenerator.prototype.projectfiles = function projectfiles() {
  this.template('Gruntfile.js');
};
