# Backbone.MongoCollection

[![Build Status](https://magnum.travis-ci.com/alexhancock/backbone-mongo.png?token=AqmVkZFx1y67sssTsTY1&branch=master)](https://magnum.travis-ci.com/alexhancock/backbone-mongo)

Query ```Backbone.Collection``` with the mongodb API.

```JavaScript
var players = new Backbone.MongoCollection();

players.insert({ name: 'Alex', score: 10 });
players.insert({ name: 'Claire', score 20 });

players.find({}) // [{ name: 'Alex': score: 10 }, { name: 'Claire', score: 20 }]
players.find({ score: { $gt: 15 } }); // [{ name: 'Claire', score: 20 }];
```
