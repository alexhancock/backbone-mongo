requirejs.config({    
  baseUrl: '/',
  paths: {
    'underscore': 'components/underscore',
    'backbone': 'components/backbone',
    'backbone-mongo': 'lib/backbone-mongo-collection',
    'minimongo': 'lib/minimongo',
  },
  shim: {
    'jquery': { exports: '$' },
    'underscore': { exports: '_' },
    'backbone': {
      deps: ['underscore'],
      exports: 'Backbone'
    },
    'minimongo': {
      exports: 'LocalCollection'
    },
    'lib/synch-queue': ['lib/random'],
    'lib/oid': ['minimongo'],
    'lib/selector': ['minimongo'],
    'lib/diff': ['minimongo'],
    'lib/random': [],
    'lib/minimongo-modify': ['minimongo'],
    'backbone-mongo': {
      exports: 'MongoCollection',
      deps: [
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
  }
});
