'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var colors = require('colors');
var npm = require('npm');

var InstallGenerator = module.exports = function InstallGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);
};

util.inherits(InstallGenerator, yeoman.generators.NamedBase);

// npm install --save-dev [packageName]
InstallGenerator.prototype.install = function install() {
  var done = this.async();
  var conf = {'save-dev': true};
  npm.load(conf, function(err) {
    if(err) throw new Error(err);

    npm.commands.install([this.name], function (err, data) {
        if (err) {
          var msg = 'Error: '.bold.red + 'Cannot find ' + this.name.underline;
          this.log.writeln(msg);
          return done();
        }
        // command succeeded, and data might have some info
        var msg = 'Installed: '.bold.green + this.name.underline;
        this.log.ok(msg);
        done();
    }.bind(this));
  }.bind(this));
};

// update Gruntfile with npm.loadNpmTasks([packageName])
InstallGenerator.prototype.update = function update() {
  var done = this.async();
  this.sourceRoot(process.cwd());
  // regex for finding where to insert new loadNpmTasks
  var regex = /(grunt\.loadNpmTasks\(['\w-]+\);?)/g;
  // task to add
  var addition = '\n    grunt.loadNpmTasks(\'' + this.name + '\');\n'
  var gruntfile = this.read('Gruntfile.js').split(regex);

  // abort if nowhere to insert task
  if(gruntfile.length == 1) {
    var message = 'Error: '.bold.red + 'not able to auto insert ' +
   'into Gruntfile.js, please add the following line manually: ' +
   '`' + addition.trim() +'`'
    this.log.writeln(message);
    return done();
  }
  gruntfile.splice(-1, 0, addition);
  gruntfile = gruntfile.join('');

  this.write('Gruntfile.js', gruntfile);
  done();
};
