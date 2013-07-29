requirejs.config({    
  baseUrl: '/',
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
    'minimongo': {
      exports: 'LocalCollection',
      deps: ['underscore']
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
    'backbone-mongo':[
      'underscore',
      'backbone',
      'minimongo',
      'lib/minimongo-modify',
      'lib/ejson',
      'lib/oid',
      'lib/random',
      'lib/selector',
      'lib/synch-queue',
      'lib/diff'
    ]
  }
});
