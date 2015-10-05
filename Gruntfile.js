module.exports = function(grunt) {
	grunt.initConfig({
		ts: {
			default : {
				src: [
					"public/js/typings/**/*.ts",
					"public/js/shared/*.ts",
					"public/js/presentation/controllers/*.ts",
					"public/js/presentation/app.ts"
				],
				dest: "public/js/master.js",
				options: {
					sourceMap: false
				}
			}
		},
		watch: {
			options: {
				livereload: true,
			},
			ts: {
				files: ["public/**/*.ts"],
				tasks: ["ts"]
			},
			css: {
				files: "public/**/*.scss",
				tasks: ["sass"]
			},
			html: {
				files: ['public/*.html'],
				options: {
					livereload: true
				}
			}
		},
		sass: {
			dist: {
				options: {
					style: "compressed"
				},
				files: {
					"public/css/style.css" : "public/sass/style.scss"
				}
			}
		}
	});
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.registerTask("default", ["ts", "sass", "watch"]);
};