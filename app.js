define(function(require){

  var MongoCollection = require('backbone-mongo');
  var $ = require('jquery');

  var json = require('components/data');
  
  // Intentional global
  var collection = new MongoCollection();
      collection.insert({ name: 'Alex', score: 4 });
      collection.insert([{ name: 'Claire', score: 5 }, { name:'Alex', score: 20 }]);
      collection.insert({ name: 'Doug', score: 2 }, { at: 2 });
      collection.insert({ name: 'Ben', score: 3 }, { sort: true });
      collection.insert(json); // Most of the data

  var query = $('#query');

  var runQuery = function(e) {
      if (e.which == 13){
          e.preventDefault();
          var command = $(e.target).val();
          var result, commandResult;
          try {
            commandResult = eval(command);
          } catch (err){
            debugger;
            $('.results').html(err.toString());
          } finally {
            try {
              result = JSON.stringify(commandResult, 2, 2);
            } catch (err){
              result = commandResult;
            }
            $('.results').html(result);
          }
      }
  };

  query.on('keyup', runQuery);

  return collection;

});
