module.exports = function(grunt) {
	grunt.initConfig({
		express: {
			build: {
				options : {
					server: ('controllers/controller.js')
				}
			}	
		},
		jshint: {
			files: ['Gruntfile.js', 'controllers/controller.js', 'shared/annuaire.js'],
			options: {
				globals: {
					jQuery: true
				}
			}
		}
	});

	grunt.registerTask('build', ['jshint', 'express', 'express-keepalive']);
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-contrib-jshint');
};