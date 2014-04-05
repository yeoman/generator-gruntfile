module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%%= pkg.name %> - v<%%= pkg.version %> - ' +
            '<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %>;' +
            ' Licensed <%%= props.license %> */\n',
        // Task configuration<% if (minConcat) { %>
        concat: {
            options: {
                banner: '<%%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['<%= libDir %>/<%= appname %>.js'],
                dest: 'dist/<%= appname %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%%= banner %>'
            },
            dist: {
                src: '<%%= concat.dist.dest %>',
                dest: 'dist/<%= appname %>.min.js'
            }
        },<% } %><% if (!hasJshint) {%>
        jshint: {
            options: {
                node: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                eqnull: true,<% if (dom) { %>
                browser: true,<% } %><% if (jquery || testTask === 'qunit') { %>
                globals: { jQuery: true },<% } %>
                boss: true
            },<% } %>
            gruntfile: {
                src: 'gruntfile.js'
            },
            lib_test: {
                src: ['<%= libDir %>/**/*.js', '<%= testDir %>/**/*.js']
            }
        },<% if (dom) { %>
        <%= testTask %>: {
            files: ['<%= testDir %>/**/*.html']
        },<% } else { %>
        <%= testTask %>: {
            files: ['<%= testDir %>/**/*_test.js']
        },<% } %>
        watch: {
            gruntfile: {
                files: '<%%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', '<%= testTask %>']
            }
        }
    });

    // These plugins provide necessary tasks<% if (minConcat) { %>
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');<% } %>
    grunt.loadNpmTasks('grunt-contrib-<%= testTask %>');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task
    grunt.registerTask('default', ['jshint', '<%= testTask %>'<%= minConcat ? ", 'concat', 'uglify'" : "" %>]);
};

