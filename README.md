# gruntfile Generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-gruntfile.png?branch=master)](https://travis-ci.org/yeoman/generator-gruntfile)

> Create a gruntfile module with [Yeoman][], including nodeunit unit tests.

This generator is based of
[grunt-init-gruntfile](https://github.com/gruntjs/grunt-init-gruntfile), authored by the
magnificient GruntJS team.

Maintained by [Addy Osmani](https://github.com/addyosmani).

[Yeoman]: http://yeoman.io/


## Installation

If you haven't already done so, install [Yeoman][].

Once Yeoman is installed, install this generator via `npm install -g generator-gruntfile`.


## Usage

At the command-line, cd into an empty directory, run this command and follow the prompts.

```
yo gruntfile
```

You can also install a grunt task package using the subgenerator `install`

```
yo gruntfile:install [package-name]
```
This will npm install the package, save it to package.json in devDependencies and  attempt to add the appropriate grunt.loadNpmTasks('...') line into your Gruntfile


_Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files._


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
