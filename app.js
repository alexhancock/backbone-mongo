window.people = new Backbone.Mongo();
people.insert({ name: 'Alex', score: 4 });
people.insert([{ name: 'Claire', score: 5 }, { name:'Alex', score: 20 }]);
people.insert({ name: 'Claire', score: 2 }, { at: 2 });
people.insert({ name: 'Ben', score: 3 }, { sort: true });
people.insert(json); // Most of the data

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