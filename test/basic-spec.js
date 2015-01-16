require('lazy-ass');
var check = require('check-more-types');

describe('self-addressed', function () {
  var stamp = require('..');

  it('is a single function', function () {
    la(check.fn(stamp));
  });
});
