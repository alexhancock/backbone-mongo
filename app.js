var collection = new Backbone.MongoCollection();

// collection.insert([{ name: 'Alex', score: 10 }, { name: 'Claire', score: 20 }]);
collection.insert({ name: 'Ben', score: 3 });
collection.insert([{ name: 'Claire', score: 5 }, {name:'Alex', score: 20}]);

collection.update({ name: 'Ben' }, { $inc: { score: 10 }, $set: { name: 'George' } });

setTimeout(function(){
  var george = collection.findOne({ name: 'George' });
  george.set('score', 100);
}, 4000);
