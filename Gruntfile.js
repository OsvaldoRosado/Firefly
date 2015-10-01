module.exports = function(grunt) {
  grunt.initConfig({
    ts: {
      default : {
        src: ["public/**/*.ts"]
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