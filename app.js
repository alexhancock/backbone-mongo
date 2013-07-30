require(['backbone-mongo'], function(MongoCollection){

  // Intentional global
  collection = new MongoCollection();

  var arr = [
    { name: 'Ben', score: 3 },
    { name: 'Alex', score: 4 },
    { name: 'Claire', score: 5 },
    { name:'Alex', score: 20 },
    { name: 'Doug', score: 2 }
  ];

  collection.insert(arr, { sort: true });

  /* collection.insert({ name: 'Ben', score: 3 }, { sort: true });
  collection.insert({ name: 'Alex', score: 4 });
  collection.insert([{ name: 'Claire', score: 5 }, { name:'Alex', score: 20 }]);
  collection.insert({ name: 'Doug', score: 2 }, { at: 2, sort: true }); */

  collection.update({ name: 'Alex' }, { $inc: { score: 10 }, $set: { name: 'George' } }, { multi: true });

  $('input[type=text]').on('keyup', function(e) {
      if (e.which == 13){
          e.preventDefault();
          var command = $(e.target).val();
          var result;
          try {
            var commandResult = eval(command);
          } catch (e){
            $('.results').html(e.toString());
          } finally {
            try {
              result = JSON.stringify(commandResult, undefined, 2);
            } catch (e){
              result = commandResult;
            }
            $('.results').html(result);
          }
      }
  });
});
