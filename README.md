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

### Tests

There is a suite of mocha tests, mainly testing for interoperability between the Backbone and Mongo pieces of the project, as well as regressions with the the full standard `Backbone.Collection` API.

To run the tests, just `npm install && grunt test`

** You may need `grunt-cli` installed globally first

### Using the library

Just drop the built file at `build/backbone-mongo.js` into your page after Backbone and Underscore are loaded. It will attach a property called `Mongo` to the `Backbone` global. This is the constructor.

### Known limitations 

* $pull in modifiers can only accept certain kinds of selectors.
* $ to denote the matched array position is not supported in modifier.
* findAndModify, upsert, aggregate functions, and map/reduce aren't yet supported.

All these things are on the Meteor team's roadmap. As they make changes to minimongo, I will port the changes into this project.

### Bugs & Issues

This is an early version of the project, so I'm sure there will be bugs and incompatibilities with some Backbone feature you like, or some Mongo feature you like. If you find one, I will welcome all opened issues & pull requests. If I don't respond via github, find me on twitter at @alexjhancock.

### TODOS

* Explore defining `Backbone.Models` as a [custom datatype](http://docs.meteor.com/#ejson_add_type) for EJSON, for cleaner integration with minimongo.
* Expose observable queries, and use minimongo's `Cursor` transform function option to return `Backbone.Models`
* Distribute project on `npm`.
* Reduce size of the built file, where possible
* Add an AMD module version of the lib to the built assets