/*global module:false*/
module.exports = function (grunt) {
  var sourceFiles = ['index.js'];
  var testFiles = ['test/*-spec.js'];

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
    }
  });

  var plugins = module.require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('lint', ['filenames', 'jshint', 'eslint', 'jscs']);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['deps-ok', 'nice-package', 'lint', 'sync', 'test']);
};
