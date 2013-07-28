define(function(require){
  require('backbone-mongo');

	describe('Backbone.MongoCollection Tests', function(){
    it('can instantiate a collection', function(){
			var coll = new Backbone.MongoCollection();
			expect(coll).toBeDefined();
		});
		
    it('can insert a document', function(){
			var coll = new Backbone.MongoCollection();
      coll.insert({ name: 'Alex' });
      expect(coll.find().length).toBe(1);
		});

    it('can insert an array of document', function(){
			var coll = new Backbone.MongoCollection();
      coll.insert([{ name: 'Alex' }, { name: 'Claire' }]);
      expect(coll.find().length).toBe(2);
		});

	});
});
