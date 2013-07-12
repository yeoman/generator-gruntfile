'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var InstallGenerator = module.exports = function InstallGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the install subgenerator with the argument ' + this.name + '.');
};

util.inherits(InstallGenerator, yeoman.generators.NamedBase);

InstallGenerator.prototype.files = function files() {
  this.copy('somefile.js', 'somefile.js');
};
