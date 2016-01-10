'use strict';

Array.prototype.unique = function() {
  var newArray = [];
  for (var i = 0, l = this.length; i < l; i++) {
    if (newArray.indexOf(this[i]) === -1 && this[i] !== '') {
      newArray.push(this[i]);
    }
  }
  return newArray;
};

Array.prototype.intersect = function(array) {
  return this.filter((x) => array.indexOf(x) != -1);
};
Array.prototype.flatten = function(array) {
  return this.reduce((prev, next) => prev.concat(next), []);
};

Array.prototype.numbers = function(array) {
  return this.filter((x) => Number.isInteger(parseInt(x)));
};

exports.getUserRoles = function(data) {
  var roles = [];
  roles.push(data)
  roles = roles.flatten().numbers().unique();
  return roles;
}

exports=Array;

