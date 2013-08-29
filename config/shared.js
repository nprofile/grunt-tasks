exports.module = {
  pkg: '<json:package.json>',
  meta: {
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("m/d/yyyy") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> Nike, Inc.;' +
      // '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */',
    nike: '/*! Nike Global Object - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("m/d/yyyy") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> Nike, Inc.;' +
      // '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
  },
  // Configuration for Clean task
  clean: ['grunt/temp'],
  exec: {
    npmInstall: {
      command: 'npm install',
      stdout: true
    }
  },
  growl: {
    watching : {
      message : "Watch task started ",
      title : "Watch Notification",
      image : __dirname + '/../../grunt/img/' + 'checkmark' + '.png'
    },
    npmInstallStart: {
      message:"About to run npm install. This may take awhile if you are not updated. ",
      title: "npm install",
      image: __dirname + '/../../grunt/img/' + 'checkmark' + '.png'
    },
    npmInstallComplete: {
      message: "Done with npm update",
      title: "npm install",
      image: __dirname + '/../../grunt/img/' + 'checkmark' + '.png'
    }
  },
  jshint: {
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
  },
  shell: {
    npmInstall: {
      command: 'npm install',
      options: {
        stdout: true
      }
    }
  }
};
