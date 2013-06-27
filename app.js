
var collection = new Backbone.MongoCollection();

collection.insert({ name: 'Alex', score: 10 });
collection.insert({ name: 'Claire', score: 20 });

// collection.sync('UPDATE', collection);
debugger;
collection.remove([{ name: 'Alex' }, { name: 'Claire' }]);
debugger;
