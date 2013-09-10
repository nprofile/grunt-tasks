/*
 * Grunt Task File
 * ---------------
 *
 * Task: templatize
 * Description: Convert HTML templates into JS modules
 */


var Handlebars = require('handlebars');

/**
 * @description Precompiles HTML files via Handlebars into new JS files.
 * @param {object} grunt Grunt instance from register().
 * @param {object} data Current task target configuration from register().
 * @param {string} name Current task target name from register().
 * @param {function} done Call after task completes.
 *     Ex. done(success) where success is a {boolean}
 * @function
 */
module.exports.runTask = function(grunt, data, name, done) {
  // Grunt utilities.
  var task = grunt.task;
  var file = grunt.file;
  var log = grunt.log;

  // Built-in modules.
  var exec = require('child_process').exec;
  var path = require('path');
  var _ = grunt.utils._;

  var namespace = data.namespace || "templatized",
      wrapper   = data.wrapper||function(text) { return text;},
      dest      = grunt.template.process(data.dest || name);

  // As a 'baby step' toward using expressions in our source and conventionalizing the configs,
  //    check the 'src' property and use that and replace the 'files'
  if( data.src && _.isString(data.src) ){
    var files     = file.expand(data.src);
    var srcFiles  = {};
    _.each(files,function(fpath){
      var key = fpath.match(/[\w.]+(?=\.\w+)/);
      if( key && key.length ){
        srcFiles[key[0]] = fpath;
      }
    });
    data.files = srcFiles;
  }

  // Concatenation of the target's one or more precompiled templates.
  var output = '';

  // Asynchronously run `handlebars` on each file.
  grunt.utils.async.forEachSeries(

    // List of files to process.
    Object.keys(data.files),

    // Iterate on each file.
    function(key, oneFileDone) {

      // Ex. key = 'widget'
      // Ex. htmlFile = 'oauth/html/widget.html'.
      var htmlFile = grunt.template.process(data.files[key]);

      var fileData = task.directive(htmlFile, file.read);

      // Ex. store pre-compilation in exports.widget
      // instead of Handlebars.templates['widget.html'].
      var tmpl = Handlebars.precompile(fileData)
        .toString()
        .trim()
        // .replace(/(Handlebars.template)[^;]*/, '$1')
        // .replace("templates['" + path.basename(htmlFile) + "']", 'exports.' + key)
        // // JSHINT fix: `handlebars` will add two-semicolons to invokePartial() lines.
        // .replace(/;;/g, ';');
        ;

      tmpl = 'exports["'+path.basename(htmlFile, data.ext || '.html')+'"]=template('+tmpl+');'
      // // Ex. "!function(exports) { <pre-compilation> }(nike.ns(<namespace>))".
      // tmpl = wrapper(tmpl, namespace);

      // console.log(tmpl);

      output += tmpl;

      // Fail task if errors were logged.
      if (this.errorCount) {
        done(false);
        oneFileDone();
        return;
      }

      // Otherwise, print a success message.
      log.writeln('Added "' + namespace + '.' + key + '" to "' + dest + '".');

      oneFileDone();

      // // Ex. '/path/to/bin/handlebars --min widgets/profile/html/widget.html'.
      // var hbCmd =
      // __dirname+
      //   '/../../../node_modules/handlebars/bin/handlebars '+
      //   htmlFile;


      // exec(hbCmd, null, function(error, stdout, stderr) {
      //   if (error) {
      //     log.error(error);
      //     done(false);
      //     oneFileDone();
      //     return;
      //   }

      //   // Ex. store pre-compilation in exports.widget
      //   // instead of Handlebars.templates['widget.html'].
      //   var tmpl = stdout
      //     .toString()
      //     .trim()
      //     .replace(/(Handlebars.template)[^;]*/, '$1')
      //     .replace("templates['" + path.basename(htmlFile) + "']", 'exports.' + key)
      //     // JSHINT fix: `handlebars` will add two-semicolons to invokePartial() lines.
      //     .replace(/;;/g, ';');

      //   // Ex. "!function(exports) { <pre-compilation> }(nike.ns(<namespace>))".
      //   tmpl = wrapper(tmpl, namespace);
      //   output += tmpl;

      //   // Fail task if errors were logged.
      //   if (this.errorCount) {
      //     done(false);
      //     oneFileDone();
      //     return;
      //   }

      //   // Otherwise, print a success message.
      //   log.writeln('Added "' + namespace + '.' + key + '" to "' + dest + '".');

      //   oneFileDone();
      // });
    },
    // All source files processed. Write out the concatenation.
    function() {

      output = 'var template=Handlebars.template;'+output;

      // Ex. "!function(exports) { <pre-compilation> }(nike.ns(<namespace>))".
      output = wrapper(output, namespace);

      file.write(dest, output);
      done(true);
    }
  );
};

/**
 * @description Performs task-specific registration. Called by grunt.js.
 *     Delegate actual task work to runTask().
 * @param {object} grunt Grunt instance from grunt.js.
 * @function
 */
module.exports.register = function(grunt) {
  grunt.registerMultiTask(
    'templatize2',
    'Convert HTML templates into JS modules',
    function() {
      // Inject runTask's dependencies.
      grunt.utils._.bind(module.exports.runTask, this)(
        grunt,
        this.data,
        this.target,

        // If this were a synchronous task, we would just use function() {}.
        this.async()
      );
    }
  );

};

