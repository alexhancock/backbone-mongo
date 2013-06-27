define(function(require){
  require('backbone-mongo');

	describe('Backbone.MongoCollection Tests', function(){
		
    it ('Should be able to instantiate a collection', function(){
			var coll = new Backbone.MongoCollection();
			expect(coll).toBeDefined();
		});
		
    it ('Should be able to insert a document', function(){
			var coll = new Backbone.MongoCollection();
      coll.insert({ name: 'Alex' });
      expect(coll.find().length).toBe(1);
		});

	});
});
