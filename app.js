var collection = new Backbone.MongoCollection();

// collection.insert([{ name: 'Alex', score: 10 }, { name: 'Claire', score: 20 }]);
collection.insert({ name: 'Ben', score: 3 });
collection.insert([{ name: 'Claire', score: 3 }, {name:'Al', score: 20}]);

collection.store.find({ score: { $gt: 50 }}).observe({
  added: function(doc){
    console.log(doc);
  }
});

setTimeout(function(){
  var ben = collection.findOne({ name: 'Ben' });
  ben.set('score', 100);
}, 4000);

/* 
 
collection.comparator = function(doc){
  return doc.get('score');
};

// collection.add({ name: 'Ben', score: 30 }, { at: 1 });
var all = collection.find({ score: { '$gt' : 1 }});


*/
