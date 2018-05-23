var _ = require('lodash');

var utils = module.exports = {
  sort : function(nodes){
    var split = _.groupBy(_.sortBy(nodes, 'id'), 'isFolder');
    split[true] = split[true] || [];
    split[false] = split[false] || [];
    return split[true].concat(split[false]);
  }
};