var shared = ["public/js/typings/**/*.ts", "public/js/shared/*.ts"];

module.exports = function(grunt) {
	grunt.initConfig({
		ts: {
			presentation: {
				src: shared.concat([
					"public/js/presentation/controllers/*.ts",
					"public/js/presentation/app.ts"
				]),
				dest: "public/js/presentation/master.js",
				options: {
					sourceMap: false
				}
			}
		},
		watch: {
			ts: {
				files: ["public/**/*.ts"],
				tasks: ["ts"]
			}
		}
	});
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.registerTask("default", ["ts", "watch"]);
};