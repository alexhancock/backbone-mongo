
var collection = new Backbone.MongoCollection();
    collection.insert({ name: 'Alex', score: 10 });
    collection.insert({ name: 'Claire', score: 20 });

var bulk = new Backbone.MongoCollection([{ name: 'alex'}, { name: 'claire' }]);
