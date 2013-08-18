requirejs.config({    
  baseUrl: '',
  paths: {
    'backbone-mongo': 'lib/backbone-mongo-collection',
    'minimongo': 'lib/minimongo',
  },
  shim: {
    'jquery': { exports: '$' },
    'ordered_dict': {
      exports: 'OrderedDict',
    },
    'minimongo': {
      exports: 'LocalCollection',
      deps: ['lib/deps', 'lib/ordered_dict']
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
