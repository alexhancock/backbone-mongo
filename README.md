Query ```Backbone.Collection``` with the mongodb API.

```JavaScript
var players = new Backbone.MongoCollection();

players.insert({ name: 'Alex', score: 10 });
players.insert({ name: 'Claire', score 20 });

players.find({}) // [{ name: 'Alex': score: 10 }, { name: 'Claire', score: 20 }]
players.find({ qty: { $gt: 11 } }); // [{ name: 'Claire', score: 20 }];
```
