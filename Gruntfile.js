var shared = ["public/js/typings/**/*.ts", "public/js/shared/*.ts"];

var ngtemplatesOpts = {
	htmlmin: {
	  collapseBooleanAttributes:      true,
	  collapseWhitespace:             true,
	  removeAttributeQuotes:          true,
	  removeComments:                 true,
	  removeEmptyAttributes:          true,
	  removeRedundantAttributes:      true,
	  removeScriptTypeAttributes:     true,
	  removeStyleLinkTypeAttributes:  true
	}
}

module.exports = function(grunt) {
	grunt.initConfig({
		ngtemplates: {
			playground: {
				src: [
					'public/directives/ff-content/*.html',
					'public/directives/ff-content-box/*.html',
					'public/directives/ff-question/*.html'
				],
				dest: 'public/js/component-playground/templates.js',
				options: ngtemplatesOpts
			},
			presenter: {
				src: [
					'public/directives/ff-content/*.html',
					'public/directives/ff-content-box/*.html',
					'public/directives/ff-question/*.html'
				],
				dest: 'public/js/presenter/templates.js',
				options: ngtemplatesOpts
			},
			presentation: {
				src: [
					'public/directives/ff-content/*.html',
					'public/directives/ff-question/*.html'
				],
				dest: 'public/js/presentation/templates.js',
				options: ngtemplatesOpts
			},
			viewer: {
				src: [
					'public/directives/ff-content/*.html',
					'public/directives/ff-content-box/*.html',
					'public/directives/ff-question/*.html'
				],
				dest: 'public/js/viewer/templates.js',
				options: ngtemplatesOpts
			}
		},
		ts: {
			presentation: {
				src: shared.concat([
					"public/js/shared/*.ts",
					"public/directives/ff-content/*.ts",
					"public/directives/ff-question/*.ts",
					"public/directives/floating-content/*.ts",
					"public/js/presentation/controllers/*.ts",
					"public/js/presentation/app.ts"
				]),
				dest: "public/js/presentation/master.js",
				options: {
					sourceMap: false
				}
			},
			presenter: {
				src: shared.concat([
					"public/js/shared/*.ts",
					"public/directives/**/*.ts",
					"public/js/presenter/util/*.ts",
					"public/js/presenter/controllers/*.ts",
					"public/js/presenter/app.ts"
				]),
				dest: "public/js/presenter/master.js",
				options: {
					sourceMap: false
				}
			},
			playground: {
				src: shared.concat([
					"shared/data-types.ts",
					"public/directives/collapse/*.ts",
					"public/directives/ff-content/*.ts",
					"public/directives/ff-content-box/*.ts",
					"public/directives/ff-question/*.ts",
					"public/js/component-playground/playground.ts"
				]),
				dest: "public/js/component-playground/playground.js",
				options: {
					sourceMap: false
				}
			},
			viewer: {
				src: shared.concat([
					"shared/data-types.ts",
					"public/directives/collapse/*.ts",
					"public/directives/ff-content/*.ts",
					"public/directives/ff-content-box/*.ts",
					"public/directives/ff-question/*.ts",
					"public/js/viewer/controllers/*.ts",
					"public/js/viewer/viewer.ts"
				]),
				dest: "public/js/viewer/viewer.js",
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
				files: ['public/**/*.html'],
				tasks: ["ngtemplates"],
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
			},
			viewer: {
				options: {
					style: "compressed"
				},
				files: {
					"public/css/viewer.css" : "public/sass/viewer.scss"
				}
			},
			playground: {
				options: {
					style: "compressed"
				},
				files: {
					"public/css/component-playground.css" : "public/sass/component-playground.scss"
				}
			},
			presentation: {
				options: {
					style: "compressed"
				},
				files: {
					"public/css/presentation.css" : "public/sass/presentation.scss"
				}
			},
			index: {
				options: {
					style: "compressed"
				},
				files: {
					"public/css/index.css" : "public/sass/index.scss"
				}
			}
		}
	});
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.registerTask("default", ["ngtemplates", "ts", "sass", "watch"]);
};
