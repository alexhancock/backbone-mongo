var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return (/spec\.js/).test(file);
});

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',
    paths: {
      'underscore': 'components/underscore',
      'backbone': 'components/backbone',
      'backbone-mongo': 'lib/backbone-mongo-collection',
      'minimongo': 'lib/minimongo',
      'sinon': 'components/sinon'
    },
    shim: {
      'underscore': {
        exports: '_'
      },
      'backbone': {
        deps: ['underscore'],
        exports: 'Backbone'
      },
      'ordered_dict': {
        deps: ['underscore'],
        exports: 'OrderedDict',
      },
      'minimongo': {
        exports: 'LocalCollection',
        deps: ['underscore', 'lib/deps', 'lib/ordered_dict']
      },
      'sinon': {
        exports: 'sinon'
      },
      'lib/synch-queue': ['lib/random'],
      'lib/oid': ['minimongo'],
      'lib/selector': ['minimongo'],
      'lib/diff': ['minimongo'],
      'lib/random': ['underscore'],
      'lib/minimongo-modify': ['minimongo'],
      'lib/deps': ['underscore'],
      'backbone-mongo':[
        'underscore',
        'backbone',
        'minimongo',
        'lib/deps',
        'lib/minimongo-modify',
        'lib/ejson',
        'lib/oid',
        'lib/random',
        'lib/selector',
        'lib/synch-queue',
        'lib/diff'
      ]
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,
    // start test run, once Require.js is done
    callback: window.__karma__.start
});
