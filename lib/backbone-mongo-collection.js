Backbone.MongoCollection = Backbone.Collection.extend({

  // Current Big TODOS - _byID

  /* Standard Backbone Collection Overrides */
  extend: function(props){
    _.extend(this, props);
  },

  initialize: function(models, options){
    options || (options = {});
    if (options.url) this.url = options.url;
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();

    // Set up out MiniMongo LocalCollection
    this.models = new LocalCollection();
    if (models) this.reset(models, _.extend({silent: true}, options));
  },
  
  toJSON: function(){
    return this.find();
  },

  add: function(model, options){
    options || (options = {});

    if (_.isArray(model)){
      _.each(model, this.add);
    } else {
      if (!(model = this._prepareModel(model, options))){
        model = this._prepareModel(model, options);
      }
      // this._byID[model.id] = model;
      if (!options.silent) this.trigger('add', model);
      this.models.insert(model);
    }

    return model;
  },
  find: function(query, options){
    query = query || {};
    return this.models.find(query, options).fetch();
  },
  update: function(mod){
    return this.models.update(mod);
  },
  sync: function(method, collection, options){
    options || (options = {});
    
    if (!options.url) options.url = this.url;

    return Backbone.sync.apply(this, [method, collection, options]);

    // Needs more testing
  },
  reset: function(models, options){
    options || (options = {});

    this.models.remove({});
    this.add(models, _.extend({ silent:  true }, options));

    if (!options.silent) this.trigger('reset', this, options);

    return this;
  },
  at: function(idx){
    return _.toArray(this.models.docs)[idx];
  },

  remove: function(models, options){
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
  },

  _reset: function(){
    this.length = 0;
    this.models= [];
    this._byId  = {};
  },

  findWhere: function(query){
    return this.models.find({ attributes: query }).fetch();
  },

  /* Mongo Style Collection Modification */
  insert: function(models){
    return this.add(models);
  }


});
