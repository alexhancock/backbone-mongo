define(function(require){
  var Mongo = require('backbone-mongo');
  var data = require('components/data');

  var people = new Mongo();

  people.insert(data);

  people.find({ name: 'Alex' });

  people.insert({ name: 'Alex', score: 11 });
  people.insert({ name: 'Claire', score: 11 });

  var query = $('#query');

  var runQuery = function(e) {
      if (e.which == 13){
          e.preventDefault();
          var command = $(e.target).val();
          var result, commandResult;
          try {
            commandResult = eval(command);
          } catch (err){
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

  return people;
});
