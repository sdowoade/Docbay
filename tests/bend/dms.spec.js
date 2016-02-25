'use strict';
var mongoose = require('../../server/config/db'),
  mockgoose = require('mockgoose');

mockgoose(mongoose);
describe('Document management system', () => {

  afterAll((done) => {
    mockgoose.reset(() => {
      done();
    });
  });

  require('./user.spec.js');
  require('./document.spec.js');
  require('./role.spec.js');
});
