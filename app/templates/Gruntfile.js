'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({<% if (minConcat) { %>
        // Metadata.<% if (packageJSON) { %>
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%%= pkg.name %> - v<%%= pkg.version %> - ' +
            '<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %>;' +
            ' Licensed <%%= props.license %> */\n',<% } else { %>
        meta: {
            version: '0.1.0'
        },
        banner: '/*! PROJECT_NAME - v<%%= meta.version %> - ' +
            '<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* http://PROJECT_WEBSITE/\n' +
            '* Copyright (c) <%%= grunt.template.today("yyyy") %> ' +
            'YOUR_NAME; Licensed MIT */\n',<% } } %>
        // Task configuration.<% if (minConcat) { %>
        concat: {
            options: {
                banner: '<%%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['<%= libDir %>/<%= fileName %>.js'],
                dest: 'dist/<%= fileName %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%%= banner %>'
            },
            dist: {
                src: '<%%= concat.dist.dest %>',
                dest: 'dist/<%= fileName %>.min.js'
            }
        },<% } %>
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,<% if (dom) { %>
                browser: true,<% } %>
                globals: {<% if (jquery) { %>
                    jQuery: true
                <% } %>}
            },
            gruntfile: {
                src: 'Gruntfile.js'
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

    // These plugins provide necessary tasks.<% if (minConcat) { %>
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');<% } %>
    grunt.loadNpmTasks('grunt-contrib-<%= testTask %>');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['jshint', '<%= testTask %>'<%= minConcat ? ", 'concat', 'uglify'" : "" %>]);

};
