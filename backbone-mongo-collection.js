Backbone.MongoCollection = Backbone.Collection.extend({
  initialize: function(models){
    this.store = new LocalCollection();
    // TODO - Implement array reset support in minimongo
    _.each(models, _.bind(function(model){
        this.store.insert(model);
    }, this));
  },
  insert: function(doc){
    return this.store.insert(doc);
  },
  find: function(query, options){
    query = query || {};
    return this.store.find(query, options).fetch();
  },
  update: function(mod){
    return this.store.update(mod);
  }
});
