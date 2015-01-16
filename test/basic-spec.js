require('lazy-ass');
var check = require('check-more-types');

describe('self-addressed', function () {
  var stamp = require('..');

  it('is a single function', function () {
    la(check.fn(stamp));
  });

  var address = {
    deliver: function (envelope) {
      console.log('delivered envelope', envelope);

      var open = stamp;
      var letter = open(envelope);
      la(letter === 'foo', 'invalid letter contents', letter);
    }
  };

  var mailman = function (address, letter) {
    la(address, 'missing address');
    la(arguments.length === 2, 'missing letter', arguments);
    address.deliver(letter);
  };

  it('delivers letter', function () {
    stamp(mailman, address, 'foo');
  });
});
