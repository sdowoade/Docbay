/*Creates default public role*/
'use strict';
process.env.NODE_ENV = 'testing';
var roleModel = require('../../server/models/role');
roleModel.count({}, function(err, count) {
  if (count === 0) {
    roleModel.create({
      title: '_Public',
    }, (err, role) => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
