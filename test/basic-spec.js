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

  var barAddress = {
    deliver: function (envelope) {
      console.log('delivered envelope to bar', envelope);

      var open = stamp;
      var letter = open(envelope);
      la(letter === 'bar', 'invalid letter contents for bar', letter);
    }
  };

  // puts new letter into the envelope
  var resealed;
  var resealAddress = {
    deliver: function (envelope) {
      resealed = stamp(envelope, 'bar');
      la(resealed === envelope, 'keeps same envelope');
    }
  };

  // responds
  var liveAddress = {
    deliver: function (envelope) {
      console.log('delivered envelope', envelope);

      var open = stamp;
      var letter = open(envelope);
      la(letter === 'foo', 'invalid letter contents', letter);

      stamp(envelope, 'bar');
      stamp(mailman, barAddress, envelope);
    }
  };

  var mailman = function (address, letter) {
    la(address, 'missing address');
    la(arguments.length === 2, 'missing letter', arguments);
    la(check.fn(address.deliver), 'address.deliver missing', address);
    address.deliver(letter);
  };

  it('delivers letter', function () {
    stamp(mailman, address, 'foo');
  });

  it('returns a promise', function () {
    var receipt = stamp(mailman, address, 'foo');
    la(check.object(receipt), 'got receipt');
    la(check.fn(receipt.then), 'has .then');
  });

  it('can reseal envelope', function () {
    stamp(mailman, resealAddress, 'foo');
    la(resealed, 'has resealed envelope');
    var response = stamp(resealed);
    la(response === 'bar', 'resealed envelope has new letter', response);
  });

  it.skip('can return in the same envelope', function () {
    var receipt = stamp(mailman, liveAddress, 'foo');
    return receipt.then(function (envelope) {
      la(envelope, 'got back envelope', envelope);
    });
  });
});
