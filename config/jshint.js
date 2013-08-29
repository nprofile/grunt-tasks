module.exports.jshint = {
  options: {
    curly: true,
    eqeqeq: true,
    newcap: true,
    noarg: true,
    undef: true,
    node: true,
    expr: true,
    strict: false
    // See here for other options to consider using
    // https://gist.github.com/1263182

  },
  globals: {
    nike: true,
    define: true,
    Backbone: true,
    _: true,
    jQuery: true,
    EventEmitter2: true,
    Plates: true,
    Modernizr: true,
    localStorage: true
    // jQuery: true   // browser
    // exports: true, // commonjs
    // module: true   // commonjs
  }
};
