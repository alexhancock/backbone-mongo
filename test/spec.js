define(function(require){
  require('backbone-mongo');

  var sinon = require('sinon');
  var chai = require('components/chai');
  var assert = chai.assert;
  var coll;

	describe('Backbone.MongoCollection Tests', function(){

    beforeEach(function(){
      coll = new Backbone.MongoCollection();
    });

    afterEach(function(){
      coll = undefined;
    });

    it('can instantiate a collection', function(){
			assert.isDefined(coll);
      assert.isDefined(coll.models);
      assert.isTrue(coll instanceof Backbone.MongoCollection);
		});
		
    it('can insert a document', function(){
      coll.insert({ name: 'Alex' });
      assert.equal(coll.find().length, 1);
		});

    it('can insert an array of document', function(){
      coll.insert([{ name: 'Alex' }, { name: 'Claire' }]);
      assert.equal(coll.find().length, 2);
		});

    it('maintains an array representation of all documents in the collection on the models property', function(){
      coll.insert({ name: 'Alex' });
      assert.isArray(coll.models);
      assert.lengthOf(coll.models, 1);
      coll.insert({ name: 'Claire' });
      assert.lengthOf(coll.models, 2);
		});

    it('returns an array containing the attributes hash of each model from toJSON()', function(){
      coll.insert({ name: 'Alex' });
      coll.insert({ name: 'Claire' });

      var fromToJSON = coll.toJSON();
      assert.isArray(fromToJSON);
      assert.lengthOf(fromToJSON, 2);

      assert.equal(fromToJSON[0].name, 'Alex');
      assert.equal(fromToJSON[1].name, 'Claire');
		});

    it('falls back to default Backbone.sync', function(){
      var syncStub = sinon.stub(Backbone, 'sync');
    
      coll.insert({ name: 'Alex' });
      coll.insert({ name: 'Claire' });

      coll.sync();

      assert.isTrue(syncStub.called);

      syncStub.restore();
		});
    it('can add models via the backbone.add and then query them with mongo syntax', function(){
      coll.add({ name: 'Alex', score: 5 });
      coll.add({ name: 'Claire', score: 10 });

      var res = coll.find({ score: { $gt: 6 } });
      assert.lengthOf(res, 1);
    });
    it('can add models via mongo style insert and then access them with Backbone at() and findWhere()', function(){
      coll.insert({ name: 'Alex', score: 5 });
      assert.equal(coll.at(0).get('name'), 'Alex');
      assert.equal(coll.at(0).get('score'), 5);
    });

    it('calls through to the normal Backbone.Collection.add when insert is called', function(){
      var addSpy = sinon.spy(coll, 'add');
      coll.insert({ name: 'Alex', score: 5 });
      assert.isTrue(addSpy.called);
    });
    it('calls through to the normal Backbone.Collection.set when add is called', function(){
      var setSpy = sinon.spy(coll, 'set');
      coll.add({ name: 'Alex', score: 5 });
      assert.isTrue(setSpy.called);
    });

    it('removes documents in the mongo collection as well, when remove is called', function(){
      coll.insert({ name: 'Alex', score: 5 });
      var first = coll.at(0);
      coll.remove(first);
      assert.lengthOf(coll.store.find().fetch(), 0);

      coll.insert({ name: 'Alex', score: 5 });
      coll.insert({ name: 'Alex', score: 5 });
      coll.insert({ name: 'Alex', score: 5 });
      coll.insert({ name: 'Alex', score: 5 });
      coll.remove({});

      // assert.lengthOf(coll.models, 0); TODO 
      // assert.lengthOf(coll.store.find().fetch, 0);
    });

    it('can use the Backbone.Collection remove implementation on documents added via insert', function(){
      coll.insert({ name: 'Alex', score: 5 });
      var first = coll.at(0);
      coll.remove(first);
      assert.lengthOf(coll.models, 0);
    });
    it('fires a remove event when a model is removed', function(){
      coll.insert({ name: 'Alex', score: 5 });

      var triggerStub = sinon.stub(coll, 'trigger', function(e, model){
        assert.equal(e, 'remove');
        assert.isDefined(model.get('name'));
        assert.isDefined(model.get('score'));
      });

      coll.remove(coll.at(0));
      assert.isTrue(triggerStub.called);

      triggerStub.restore();
    });

    it('supports use of the standard Backbone.Collection reset and empties both the models array and store LocalCollection when called with no models', function(){
      coll.insert({ name: 'Alex', score: 5 });

      coll.reset();

      assert.lengthOf(coll.store.find().fetch(), 0);
      assert.lengthOf(coll.models, 0);
    });

    it('supports use of the standard Backbone.Collection reset to bootstrap the content of both the models array and the LocalCollection', function(){
      coll.reset([{ name: 'Alex', score: 5 }, { name: 'Claire', score: 10 }]);
      assert.lengthOf(coll.store.find().fetch(), 2);
      assert.lengthOf(coll.models, 2);
    });
    it('supports the standard Backbone.Collection set for individual properties and ports changes in the LocalCollection as well', function(){
      coll.insert({ name: 'Alex', score: 5 });

      var first = coll.at(0);
      first.set('name', 'Barack');

      assert.equal(coll.store.find().fetch()[0].name, 'Barack');
    });

    it('adds/removes models intelligently when .set() is called', function(){
      var one = { name: 'Alex' };
      var two = { name: 'Claire' };

      coll.insert(one);
      var first = coll.at(0);

      var triggerStack = [];
      var triggerStub = sinon.stub(coll, 'trigger', function(e, model){
        triggerStack.push([e, model]);
      });

      coll.set([one, two]);

      assert.equal(triggerStack[0][0], 'remove');
      assert.equal(triggerStack[0][1], first);

      assert.equal(triggerStack[1][0], 'add');
      assert.equal(triggerStack[1][1].attributes.name, one.name);

      assert.equal(triggerStack[2][0], 'add');
      assert.equal(triggerStack[2][1].attributes.name, two.name);
    });
    it('supports the standard Backbone.Collection .get() by index after insertion from insert() or add()', function(){
      coll.insert({ name: 'Alex', score: 5, id: 1 });
      assert.isDefined(coll.get(1));
      assert.equal(coll.get(1).get('name'), 'Alex');

      coll.add({ name: 'Barack', score: 5, id: 2 });
      assert.equal(coll.get(2).get('name'), 'Barack');
    });
    it('sets the idAttribute property per normal on Models in the Collection', function(){
      var Person = Backbone.Model.extend({
        idAttribute: '_id',
      });

      var me = new Person({ _id: 'A01', name: 'Alex' });
      coll.insert(me);

      assert.equal(me.id, 'A01');
    });
    it('saves only CIDs + the attributes hash on the object that ends up in minimongo', function(){
      var Person = Backbone.Model.extend({
        idAttribute: '_id',
      });

      var me = new Person({ _id: 'A01', name: 'Alex' });
      coll.insert(me);

      assert.sameMembers(["_id", "name", "cid"], _.keys(coll.store.find().fetch()[0]));
    });

    it('maintains the standard "changed" hash on each model containing attributes modified by a mongo update() since the last "change" event was triggered', function(){
      coll.insert({ name: 'Alex', score: 5, id: 1 });
      coll.update({ name: 'Alex' }, { $inc: { score: 10 }, $set: { name: 'George' } });
      assert.isDefined(coll.at(0).changed);
      assert.isDefined(coll.at(0).changed.name);
      assert.isDefined(coll.at(0).changed.score);
    });

    it('allows for access of models in the collection by the standard Backbone.Collection at()', function(){
      coll.insert({ name: 'Alex', score: 5 });
      coll.add({ name: 'Barack', score: 5 });

      assert.isDefined(coll.at(0));

      assert.equal(coll.at(0).get('name'), 'Alex');
      assert.equal(coll.at(1).get('name'), 'Barack');
    });

    it('supports the insertion of models at a particular numerical index via the { at: __ } option', function(){
      coll.insert({ name: 'Alex', score: 5 });
      coll.insert({ name: 'Barack', score: 5 }, { at: 0 });
      assert.equal(coll.at(0).get('name'), 'Barack');
      assert.equal(coll.at(1).get('name'), 'Alex');
    });

    it('supports the addition of models at the end of the collection via push()', function(){
      coll.insert({ name: 'Alex', score: 5 });
      coll.push({ name: 'Barack', score: 5 });
      assert.equal(coll.at(1).get('name'), 'Barack');
    });

    it('supports the addition of models at the beginning of the collection via unshift()', function(){
      coll.insert({ name: 'Alex', score: 5 });
      assert.equal(coll.at(0).get('name'), 'Alex');
      coll.unshift({ name: 'Barack', score: 5 });
      assert.equal(coll.at(0).get('name'), 'Barack');
    });

    it('removes and returns the last model in the collection via pop()', function(){
      coll.insert({ name: 'Alex', score: 5 });
      coll.insert({ name: 'Barack', score: 5 });

      var last = coll.at(1);

      assert.equal(last, coll.pop());

      assert.equal(coll.models.length, 1);
      assert.equal(coll.find().length, 1);
    });

    it('removes and returns the first model in the collection via shift()', function(){
      coll.insert({ name: 'Alex', score: 5 });
      coll.insert({ name: 'Barack', score: 5 });

      var first = coll.at(0);

      assert.equal(first, coll.shift());

      assert.equal(coll.models.length, 1);
      assert.equal(coll.find().length, 1);
    });

    it('return a shallow copy of the models in the array from specific index via slice()', function(){
      coll.insert({ name: 'Alex', score: 5 });
      coll.insert({ name: 'Claire', score: 5 });
      coll.insert({ name: 'Dave', score: 5 });
      coll.insert({ name: 'Barack', score: 5 });

      var sliced = coll.slice(1, 2);

      assert.lengthOf(sliced, 1);

      assert.equal(sliced[0].get('name'), 'Claire');
    });

    it('keeps the length property of the array up to date taking into account mongo and standard Backbone operations', function(){
      coll.insert({ name: 'Alex', score: 5 });
      assert.equal(coll.length, 1);

      coll.add({ name: 'Claire', score: 5 });
      assert.equal(coll.length, 2);

      coll.remove(coll.at(0));

      assert.equal(coll.length, 1);
    });

    it('keeps the count returned from the minimongo cursor up to date taking into account mongo and standard Backbone operations', function(){
      coll.insert({ name: 'Alex', score: 5 });
      assert.equal(coll.store.find().count(), 1);

      coll.add({ name: 'Claire', score: 5 });
      assert.equal(coll.store.find().count(), 2);

      coll.remove(coll.at(0));

      assert.equal(coll.store.find().count(), 1);
    });

    describe('Sorting & Comparators', function(){
      var testSortedInsert = function(){
        coll.insert({ name: 'Alex', score: 10 });
        coll.insert({ name: 'Barack', score: 5 });

        assert.equal(coll.at(0).get('name'), 'Barack');
        assert.equal(coll.store.find().fetch()[0].name, 'Barack');
      };

      it('sorts models in the collection on insert based on a comparator if a functional comparator with 1 arg is supplied', function(){
        coll.comparator = function(doc){
          return doc.get('score');
        };
        testSortedInsert();
      });

      it('sorts models in the collection on insert based on a comparator if a functional comparator with 1 arg is supplied', function(){
        coll.comparator = function(a, b){
          if (a.get('score') < b.get('score'))
             return -1;
          if (a.get('score') > b.get('score'))
             return 1;
          // a's score equals b's score
          return 0;
        };
        testSortedInsert();
      });

      it('sorts models in the collection on insert with a string comparator', function(){
        coll.comparator = 'score';
        testSortedInsert();
      });

      it('forces a collection to resort based on the comparator when .sort() is called', function(){
        coll.insert({ name: 'Alex', score: 10 });
        coll.insert({ name: 'Barack', score: 5 });

        coll.comparator = function(doc){
          return doc.get('score');
        };

        assert.equal(coll.at(0).get('name'), 'Alex');
        coll.sort();
        assert.equal(coll.at(0).get('name'), 'Barack');
      });
    });

    it('grabs an subset array using the standard Backbone.Collection.pluck()', function(){
      coll.insert({ name: 'Alex', score: 10 });
      coll.insert({ name: 'Barack', score: 5 });
      assert.sameMembers(['Alex', 'Barack'], coll.pluck('name'));
    });
    it('grabs a filtered array using the standard Backbone.Collection.where()', function(){
      coll.insert({ name: 'Alex', score: 10 });
      coll.insert({ name: 'Barack', score: 5 });

      assert.lengthOf(coll.where({ name: 'Alex' }), 1);
    });

    it('grabs the first model matching a query using the standard Backbone.Collection.findWhere()', function(){
      coll.insert({ name: 'Alex', score: 10 });
      coll.insert({ name: 'Barack', score: 5 });

      var first = coll.at(0);
      assert.equal(coll.findWhere({ name: 'Alex' }), first);
    });

    it('can supply a URL to each model via the Collections URL property', function(){
      var FAKE_URL = '/users';
      var newColl = new Backbone.MongoCollection({}, {
        url: FAKE_URL
      });

      newColl.insert({ name: 'Alex', score: 10 });
      newColl.insert({ name: 'Barack', score: 5 });

      var first = newColl.at(0);

      assert.equal(first.url, FAKE_URL);
    });

    // Leaving out a test for Backbone.Collection.parse() since it's a no-op by default

    it('creates a deep copy of the whole collection with .clone()', function(){
      coll.insert({ name: 'Alex', score: 10 });
      coll.insert({ name: 'Barack', score: 5 });

      var newColl = coll.clone();
      
      assert.lengthOf(newColl.models, 2);
      assert.lengthOf(newColl.find(), 2);
    });
    it('calls the collection sync() function when fetch() is called', function(){
      var syncStub = sinon.stub(Backbone, 'sync');
      assert.isFalse(syncStub.called);
      coll.fetch();
      assert.isTrue(syncStub.called);
    });
    it('supports the create() convenience function to add a new instance of a model within the collection', function(){
      coll.create({ name: 'Alex', score: 10 });
      assert.equal(coll.store.find().count(), 1);
      assert.equal(coll.models.length, 1);
    });

    describe('Underscore aliased methods', function(){
      beforeEach(function(){
        coll.insert({ name: 'Alex', score: 5 });
        coll.insert({ name: 'Barack', score: 10 });
      });

      it('implements the aliased underscore (for)Each', function(){
        assert.isFunction(coll.each);
        assert.isFunction(coll.forEach);
        coll.forEach(function(doc){
          assert.isDefined(doc.get('score'));
        });
      });

      it('implements the aliased underscore map', function(){
        assert.isFunction(coll.map);
        var agg = coll.map(function(doc){
          return doc.get('name');
        });

        assert.sameMembers(['Alex', 'Barack'], agg);
      });
      it('implements the aliased underscore reduce/foldl/inject', function(){
        assert.isFunction(coll.reduce);
        assert.isFunction(coll.foldl);
        assert.isFunction(coll.inject);

        var sumOfScores = coll.reduce(function(memo, doc){
          return memo + doc.get('score');
        }, 0);

        assert.equal(sumOfScores, 15);
      });
      it('implements the aliased underscore foldr/reduceRight', function(){
        assert.isFunction(coll.reduceRight);
        assert.isFunction(coll.foldr);

        var sumOfScores = coll.reduceRight(function(memo, doc){
          return memo + doc.get('score');
        }, 0);

        assert.equal(sumOfScores, 15);
      });

      it('supports the default _.find as well as the mongo find() - and decides which to use which to use based on whether the first argument is a function', function(){
        assert.isFunction(coll.find);
        
        var found = coll.find(function(doc){
          return doc.get('score') > 5;
        });
        assert.equal(found.get('score'), 10);

        found = coll.find({});
        assert.lengthOf(found, 2);
      });

      it('implements the aliased underscore filter', function(){
        assert.isFunction(coll.filter);
        
        var filtered = coll.filter(function(doc){
          return doc.get('score') % 10 === 0;
        });

        assert.lengthOf(filtered, 1);
        _.each(filtered, function(doc){
          assert.equal(doc.get('name'), 'Barack');
        });
      });

      it('implements the aliased underscore reject', function(){
        assert.isFunction(coll.reject);
        
        var without = coll.reject(function(doc){
          return doc.get('score') === 5;
        });

        assert.lengthOf(without, 1);
        _.each(without, function(doc){
          assert.equal(doc.get('name'), 'Barack');
        });
      });

      it('implements the aliased underscore every/all', function(){
        assert.isFunction(coll.every);
        assert.isFunction(coll.all);
        
        var all = coll.every(function(doc){
          return doc.get('score') > 4;
        });
        assert.isTrue(all);
      });

      it('implements the aliased underscore any/some', function(){
        assert.isFunction(coll.any);
        assert.isFunction(coll.some);
        
        var someMatch = coll.any(function(doc){
          return doc.get('name', 'Alex');
        });

        assert.isTrue(someMatch);
      });

      it('implements the aliased underscore contains/include', function(){
        assert.isFunction(coll.contains);
        assert.isFunction(coll.include);

        var first = coll.at(0); // Somewhat contrived, but it still tests no one overrides this implementation
        var contained = coll.contains(first);

        assert.isTrue(contained);
      });

      it('implements the aliased underscore invoke', function(){
        assert.isFunction(coll.invoke);
        
        var firstSpy = sinon.spy(coll.at(0), 'toJSON');
        var jsoned = coll.invoke('toJSON');

        assert.equal(JSON.stringify(jsoned), '[{"name":"Alex","score":5},{"name":"Barack","score":10}]');
      });

      it('implements the aliased underscore max', function(){
        assert.isFunction(coll.max);
        
        var topScorer = coll.max(function(doc){
          return doc.get('score');
        });

        assert.equal(topScorer.get('name'), 'Barack');
      });

      it('implements the aliased underscore min', function(){
        assert.isFunction(coll.min);
        
        var lowScorer = coll.min(function(doc){
          return doc.get('score');
        });

        assert.equal(lowScorer.get('name'), 'Alex');
      });

      it('implements the aliased underscore sortBy', function(){
        assert.isFunction(coll.sortBy);

        coll.insert({ name: 'Claire', score: 1 });
        
        var sortedByScore = coll.sortBy(function(doc){
          return doc.get('score');
        });

        assert.ok(sortedByScore[0].get('score') < sortedByScore[1].get('score'));
        assert.ok(sortedByScore[1].get('score') < sortedByScore[2].get('score'));
      });

      it('implements the aliased underscore groupBy', function(){
        assert.isFunction(coll.groupBy);
        coll.insert({ name: 'Claire', score: 1.5 });
        coll.insert({ name: 'Chris', score: 5.5 });
        
        var groupedByRoundedScore = coll.groupBy(function(doc){
          return Math.floor(doc.get('score'));
        });
        assert.isTrue(_.has(groupedByRoundedScore, 1));
        assert.isTrue(_.has(groupedByRoundedScore, 5));
        assert.isTrue(_.has(groupedByRoundedScore, 10));

        assert.lengthOf(_.keys(groupedByRoundedScore), 3);
      });

      it('implements the aliased underscore sortedIndex', function(){
          assert.isFunction(coll.sortedIndex);
          coll.comparator = function(person) {
            return person.get('score');
          };
          var joe = coll._prepareModel({ name: 'Joe', score: 6 });
          assert.equal(coll.sortedIndex(joe, coll.comparator), 1);
      });

      it('implements the aliased underscore shuffle', function(){
        assert.isFunction(coll.shuffle);
        // TODO - Assert on something guaranteed to change when shuffle is called with a two element collection
      });

      it('implements the aliased underscore toArray', function(){
        assert.isFunction(coll.toArray);
        var arr = coll.toArray();
        assert.sameMembers(arr, coll.models);
      });

      it('implements the aliased underscore size', function(){
        assert.isFunction(coll.toArray);
        assert.equal(coll.size(), 2);
      });

      it('implements the aliased underscore first/head/take', function(){
        assert.isFunction(coll.first);
        assert.isFunction(coll.head);
        assert.isFunction(coll.take);

        for (var i = 0; i < 8; i++){
          coll.insert({ name: 'Chris' });
        };

        var first = coll.first(5);
        assert.equal(first.length, 5);
      });

      it('implements the aliased underscore initial', function(){
        assert.isFunction(coll.initial);
        var allButLast = coll.initial();
        assert.equal(coll.size()-1, allButLast.length);
        assert.equal(coll.at(0).get('name'), 'Alex');
      });

      it('implements the aliased underscore rest/tail', function(){
        assert.isFunction(coll.rest);
        assert.isFunction(coll.tail);

        for (var i = 0; i < 10; i++){
          coll.insert({ name: 'Chris' });
        };

        var rest = coll.rest(4);
        assert.equal(coll.size()-4, rest.length);
      });

      it('implements the aliased underscore last', function(){
        assert.isFunction(coll.last);
        var last = coll.last();
        assert.equal(coll.at(1), last);
      });

      it('implements the aliased underscore without', function(){
        assert.isFunction(coll.without);
        var first = coll.at(0);
        var without = coll.without(first);
        assert.lengthOf(without, 1);
        assert.equal(without[0].get('name'), 'Barack');
      });

      it('implements the aliased underscore indexOf', function(){
        assert.isFunction(coll.indexOf);
        var last = coll.last();
        assert.equal(coll.indexOf(last), 1);
      });

      it('implements the aliased underscore lastIndexOf', function(){
        assert.isFunction(coll.lastIndexOf);

        coll.remove({});

        var chris = coll._prepareModel({ name: 'Chris', score: 6 });
        var dave = coll._prepareModel({ name: 'Dave', score: 6 });

        for (var i = 0; i < 2; i++){
          coll.insert(chris);
        };
        for (var i = 0; i < 2; i++){
          coll.insert(dave);
        };

        assert.equal(coll.lastIndexOf(chris), 2);
      });

      it('implements the aliased underscore isEmpty', function(){
        assert.isFunction(coll.isEmpty);
        assert.isFalse(coll.isEmpty());
      });

      it('implements the aliased underscore chain', function(){
        assert.isFunction(coll.chain);
        var chainable = coll.chain();
        assert.isFunction(chainable.sort);
      });
    });
	});
});
