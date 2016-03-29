'use strict';

var UnderscoreFactory = function UnderscoreFactory(){
  var self = this;
  this.each = function(collection, iteratee, startIndex){
    if (!startIndex) startIndex = 0;
    for (var i = startIndex; i < collection.length; i++){
      iteratee(collection[i], i, collection);
    }
  };
  this.max = function(collection, callback){
    var maxVal = collection[0];
    if(!callback){
      callback = function(item){
        return item;
      };
    }
    self.each(collection, function(item, index, collection){
      if (callback(item) > callback(maxVal)){
        maxVal = item;
      }
    }, 1);
    return maxVal;
  };
  this.reduce = function(collection, iteratee, memo){
    var startIndex = 0;
    if (!memo){
      memo = collection[0];
      startIndex = 1;
    }
    self.each(collection, function(item, index, collection){
      memo = iteratee(memo, item);
    }, startIndex);
    return memo;
  };
  return this;
};

module.exports = UnderscoreFactory;