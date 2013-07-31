# Backbone.Mongo

[![Build Status](https://travis-ci.org/alexhancock/backbone-mongo.png?branch=master)](https://travis-ci.org/alexhancock/backbone-mongo)

### Query your ```Backbone.Collection```s with the MongoDB API.

### [Live Demo](http://alexhancock.github.io/backbone-mongo/)

##### This project is glue between...

* [Minimongo](https://github.com/meteor/meteor/tree/master/packages/minimongo) - by the [Meteor](http://meteor.com) team
* [Backbone.Collections](http://backbonejs.org/#Collection)

```javascript
var people = new Backbone.Mongo();

// Use any mongo query you like
var highScorers = people.find({ score: { $gt: 50 }}).fetch();
var obama = people.find({ name: "Barack" }).fetch();

// Inserts and updates work as well
people.insert({ name: "Claire" });
people.update({ name: "Alex" }, { $inc: { score: 10 } });
```

### API

This project is an extension of `Backbone.Collection`, thus it's entire API is supported and support for mongo operations and queries has been added.

* Calling `find(sel)` where `sel` is a mongo selector will return a `Cursor`.
* Calling `findOne(sel)` returns the first document which matches the query.
* Calling `insert(doc)` will add a `Backbone.Model` representation of the document to the collection.
* Calling `update(sel, mod)` with a selector and modifier, will apply the modifier to the matching docs.
  (Check [here](http://docs.mongodb.org/manual/core/update/#update-operators) for a full list of mongo modifiers)
* Calling `remove(sel)` will remove the matching documents. Calling it with an empty object will empty the collection.

### Cursors

On a `Cursor`, you can perform a number of data access operations.

* `fetch()` - Synchronously returns you the matching documents in the collection as an array of `Backbone.Models`
* `forEach(cb)` - Call `cb` once for each matching document, sequentially and synchronously
* `map(cb)` - Map callback over all matching documents. Returns an Array
* `count()` returns the number of documents that match a query.
* `rewind()` - Resets the query cursor. You can only call `fetch`, `forEach` and `map` once on a cursor. Call `rewind` on a cursor in order to access data on it again.

You can also watch a query and receive callbacks when the result set changes (documentation from [here](http://docs.meteor.com/#observe)).

* `observe(callbacks)` - Takes an object with any of these methods as callbacks...
	* `added(document)` or `addedAt(document, atIndex, before)`
	A new document entered the result set. The new document appears at position atIndex. `before` is the cid of the next model or `null` if the new document is at the end of the results.

	* `changed(newDocument, oldDocument)` or `changedAt(newDocument, oldDocument, atIndex)`
	The contents of a document were previously oldDocument and are now newDocument. The position of the changed document is atIndex.

	* `removed(oldDocument)` or `removedAt(oldDocument, atIndex)`
	The document oldDocument is no longer in the result set. It used to be at position atIndex.

	* `movedTo(document, fromIndex, toIndex, before)`
	A document changed its position in the result set, from fromIndex to toIndex (which is before the `Backbone.Model` whose cid is before).


### Tests

There is a suite of mocha tests, to decrease the likelihood of regressions against the Backbone.Collection or Minimongo APIs. To run the tests...

```bash
$ npm install -g grunt-cli
$ npm install && grunt test
```

### Using the library

Just drop the built [file](http://alexhancock.github.io/backbone-mongo/build/backbone-mongo.js) at `build/backbone-mongo.js` into your page after Backbone and Underscore are loaded. It will attach a property called `Mongo` to the `Backbone` global. This is the constructor.

### Known limitations 

* $pull in modifiers can only accept certain kinds of selectors.
* $ to denote the matched array position is not supported in modifier.
* findAndModify, upsert, aggregate functions, and map/reduce aren't yet supported.

All these things are on the Meteor team's roadmap. As they make changes to minimongo, I will port the changes into this project.

### Bugs & Issues

If you find any issues, I will welcome all opened issues & pull requests. If I don't respond via github, find me on twitter at @alexjhancock.

### TODOS

* Explore defining `Backbone.Models` as a [custom datatype](http://docs.meteor.com/#ejson_add_type) for EJSON, for cleaner integration with minimongo.
* Distribute project on `npm`
* Reduce size of the built file, where possible
* Add an AMD module version of the lib to the built assets