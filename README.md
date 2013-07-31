# Backbone.Mongo

[![Build Status](https://magnum.travis-ci.com/alexhancock/backbone-mongo.png?token=AqmVkZFx1y67sssTsTY1&branch=master)](https://magnum.travis-ci.com/alexhancock/backbone-mongo)

### Query your ```Backbone.Collection```s with the MongoDB API.

### This project is glue between...</h2>
<ul>
<li><a target="_blank" href="https://github.com/meteor/meteor/tree/master/packages/minimongo">Minimongo</a> - by the <a target="_blank" href="http://meteor.com">Meteor</a> team</li>
<li><a href="http://backbonejs.org/#Collection">Backbone.Collections</a></li>
</ul>

```javascript
var people = new Backbone.Mongo();

// Use any mongo query you like
var highScorers = people.find({ score: { $gt: 50 }});
var obama = people.find({ name: "Barack" });

// Inserts and updates work as well
people.insert({ name: "Claire" });
people.update({ name: "Alex" }, { $inc: { score: 10 } });
```

### Tests

There is a suite of mocha tests mainly testing for interoperability between the Backbone and Mongo pieces of the project, as well as just regressions with the the full standard Backbone.Collections API.

To run the tests, just `npm install && grunt test`

** You may need `grunt-cli` installed globally first

### API

Calling `find(sel)` where `sel` is a mongo selector will synchronously return the set of matching `Backbone.Model`s in a plain array.

### Known limitations 

* $pull in modifiers can only accept certain kinds of selectors.
* $ to denote the matched array position is not supported in modifier.
* findAndModify, upsert, aggregate functions, and map/reduce aren't yet supported.

All these things are on the meteor team's roadmap to work on, and as they make changes to minimongo, I will port the changes into this project.

### Bugs & Issues

This is an early version of the project, so I'm sure there will be bugs and incompatibilities with some Backbone feature you like, or some Mongo feature you like. If you find one, file an issue / open a pull request. If I don't respond via github, find me on twitter at @alexjhancock.

### Direct access

If you wish, you can access the underlying `minimongo` collection by referencing `collectionName.store`.

On this object...

* `.find()` returns a cursor
* With this cursor, you can run `.fetch()` to grab an array of matching documents, or `.map(itr)` or `.forEach(itr)`.
* There is support for observable queries (run a callback when someone enters/leaves the result set of a query) as well, but I plan on exposing it in a more standard way later. For now, you can read [this](http://docs.meteor.com/#observe) and play around on your own.

** Be careful, because any update operations you perform by calling update on the `store` property directly will not be reflected on the actual `Backbone.Models`. Calling `collectionName.update(mod)` with your modifier is what you want to do.