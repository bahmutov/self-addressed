/*global module:false*/
module.exports = function (grunt) {
  var sourceFiles = ['index.js'];
  var testFiles = ['test/*-spec.js'];
  var globalName = 'selfAddressed';

  grunt.initConfig({

    filenames: {
      options: {
        valid: 'dashes'
      },
      src: sourceFiles,
      test: testFiles
    },

    jshint: {
      all: sourceFiles,
      test: testFiles,
      options: {
        jshintrc: 'utils/.jshintrc',
        reporter: require('jshint-summary')
      }
    },

    eslint: {
      target: sourceFiles,
      options: {
        config: 'utils/eslint.json',
        rulesdir: ['./node_modules/eslint-rules']
      }
    },

    jscs: {
      src: sourceFiles,
      options: {
        config: 'utils/jscs.json'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: testFiles
      }
    },

    watch: {
      options: {
        atBegin: true
      },
      all: {
        files: [sourceFiles, testFiles],
        tasks: ['test', 'lint']
      }
    },

    'clean-console': {
      options: {
        timeout: 1 // seconds to wait for any errors
      },
      iframe: {
        options: {
          url: 'test/iframe/index.html'
        }
      },
      'iframe-with-extra-data': {
        options: {
          url: 'test/iframe-with-extra-data/index.html'
        }
      }
    },

    browserify: {
      src: {
        options: {
          browserifyOptions: {
            standalone: globalName
          }
        },
        src: ['index.js'],
        dest: 'dist/self-addressed.js'
      }
    }
  });

  var plugins = module.require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('lint', ['filenames', 'jshint', 'eslint', 'jscs']);
  grunt.registerTask('test', ['mochaTest', 'clean-console']);
  grunt.registerTask('default', ['deps-ok', 'nice-package', 'lint', 'sync', 'browserify', 'test']);
};
