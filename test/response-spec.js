require('lazy-ass');

describe('self-addressed', function () {
  'use strict';
  var selfAddressed = require('..');

  describe('simple data vs envelope', function () {
    function to(envelope) {
      console.log('got delivered envelope', envelope);
      if (selfAddressed.is(envelope)) {
        console.log('this is self-addressed');
        var letter = selfAddressed(envelope);
        la(letter === 'foo', 'has correct letter', envelope);
        return true;
      }
    }

    function mailman(address, envelope) {
      console.log('mailman got', envelope);
      la(address(envelope), 'delivered an envelope');
    }

    it('handles outside data', function () {
      la(!to('not an envelope'), 'knows when it is not self-addressed envelope');
    });

    it('delivers envelope with simple data', function () {
      selfAddressed(mailman, to, 'foo');
    });
  });
});
