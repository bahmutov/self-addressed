require('es6-promise').polyfill();

/* eslint no-use-before-define:0 */
function open(envelope) {
  console.log('opening envelope', envelope);

  if (envelope.replies) {
    console.log('this envelope is a reply', envelope.replies);
    console.log(stamp.__deferred);
    var defer = stamp.__deferred[envelope.stamp];
    if (defer) {
      console.log('received response', envelope);
      var letter = envelope.payload;
      if (typeof defer.resolve !== 'function') {
        throw new Error('missing resolve method for ' + envelope.stamp);
      }
      console.log('resolving with payload', letter, 'for stamp', envelope.stamp);
      delete envelope.stamp;
      delete stamp.__deferred[envelope.stamp];

      // TODO handle errors by calling defer.reject
      // if (!letter) {
      // throw new Error('missing payload in', envelope);
      // }

      defer.resolve(letter);
      console.log('after resolve');
      return;
    }
  }

  console.log('returning payload from envelope', envelope);
  return envelope.payload;
}

function hasBeenStamped(cargo) {
  return cargo && cargo.stamp;
}

function deliver(mailman, address, data) {

  var cargo = data;
  if (!hasBeenStamped(cargo)) {
    id += 1;
    cargo = {
      payload: data,
      stamp: String(id),
      replies: 0
    };
  } else {
    if (typeof cargo.replies !== 'number') {
      throw new Error('Cannot find replies property ' + JSON.stringify(cargo));
    }
    cargo.replies += 1;
  }

  setTimeout(function () {
    mailman(address, cargo);
  }, 0);

  return new Promise(function (resolve, reject) {
    stamp.__deferred[cargo.stamp] = {
      resolve: resolve.bind(this),
      reject: reject.bind(this)
    };
  });
}

function stamp(mailman, address, data) {
  console.log(arguments);

  if (typeof mailman === 'function') {
    return deliver(mailman, address, data);
  } else if (arguments.length === 2 && hasBeenStamped(mailman)) {
    var envelope = mailman;
    console.log('resealing envelope', envelope);
    data = address;
    envelope.payload = data;
    return envelope;
  } else if (arguments.length === 1 && hasBeenStamped(mailman)) {
    console.log('opening envelope?', mailman);
    if (arguments.length !== 1 ||
      typeof mailman !== 'object') {
      throw new Error('expected just data ' + JSON.stringify(arguments));
    }
    return open(mailman);
  }

  // do not have an envelope or stamp
  if (data && data.payload) {
    return data.payload;
  }
  return data;
}

stamp.is = function is(data) {
  return hasBeenStamped(data);
};

var id = 0;
stamp.__deferred = {};

module.exports = stamp;
