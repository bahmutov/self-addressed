require('lazy-ass');
var check = require('check-more-types');

describe('self-addressed', function () {
  'use strict';
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

      var letter = stamp(envelope);
      la(letter === 'bar', 'invalid letter contents for bar', letter);
    }
  };

  // puts new letter into the envelope
  var resealed;
  var resealAddress = {
    deliver: function (envelope) {
      la(envelope, 'has envelope object');
      console.log('envelope to reseal', envelope);
      resealed = stamp(envelope, 'bar');
      la(resealed === envelope, 'keeps same envelope');
      console.log('resealed envelope', resealed);
    }
  };

  // responds
  var liveAddress = {
    deliver: function (envelope) {
      console.log('delivered envelope', envelope);
      la(envelope.stamp, 'envelope is missing stamp', envelope);

      console.log('opening envelope in liveAddress', envelope);
      var letter = stamp(envelope); // open
      console.log('opened envelope in liveAddress', envelope, 'letter', letter);

      la(letter === 'foo', 'invalid letter contents', letter);
      la(envelope.stamp, 'envelope is missing stamp', envelope);

      console.log('putting new value into the envelope', envelope);
      stamp(envelope, 'bar');
      la(envelope.stamp, 'envelope is missing stamp', envelope);
      console.log('put new letter into envelope', envelope);

      console.log('sending the response back to barAddress', envelope);
      stamp(mailman, barAddress, envelope);
    }
  };

  var mailman = function (address, letter) {
    la(address, 'missing address');
    la(arguments.length === 2, 'missing letter', arguments);
    la(check.fn(address.deliver), 'address.deliver missing', address);
    setTimeout(function () {
      address.deliver(letter);
    }, 0);
  };

  it('delivers letter', function () {
    stamp(mailman, address, 'foo');
  });

  it('returns a promise', function () {
    var receipt = stamp(mailman, address, 'foo');
    la(check.object(receipt), 'got receipt');
    la(check.fn(receipt.then), 'has .then');
  });

  it('can reseal envelope', function (done) {
    stamp(mailman, resealAddress, 'foo');
    setTimeout(function () {
      console.log('finished delivery');
      la(resealed, 'has resealed envelope');
      var response = stamp(resealed);
      la(response === 'bar', 'resealed envelope has new letter', response);
      done();
    }, 10);
  });

  it('can return in the same envelope', function (done) {
    var receipt = stamp(mailman, liveAddress, 'foo');
    console.log('receipt', receipt);
    la(receipt, 'has receipt');

    receipt.then(function (letter) {
      console.log('response letter', letter);
      la(letter, 'got back letter', letter);
      done();
    });
  });
});
