var nedb = require('nedb'),
  q = require('q'),
  _ = require('lodash');

//Wrap nedb functions in promises
function qNedb(options){
  var store = new nedb(options);
  _.each(['find', 'findOne', 'insert', 'count', 'update', 'remove'], function(key){
    store['q' + key] = q.nbind(store[key], store);
  });
  store.qpagedQuery = function(params){
    var pageSize = params.pageSize || 50;
    var skip = params.page ? params.page * pageSize : 0;
    delete params.pageSize;
    delete params.page;

    return q.Promise(function(resolve, reject){
      store.find(params).sort({id : 1}).skip(skip).limit(pageSize).exec(function(err, docs){
        if(err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  };
  return store;
}

module.exports = {
  documents : qNedb({
    filename : 'server/data/documents.json',
    autoload : true,
  })
};