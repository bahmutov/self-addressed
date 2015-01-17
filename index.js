require('es6-promise').polyfill();

/* eslint no-use-before-define:0 */
function open(envelope) {
  console.log('opening envelope', envelope);
  console.log(stamp.__deferred);
  var defer = stamp.__deferred[envelope.stamp];
  if (defer) {
    console.log('received response', envelope);
    setTimeout(function () {
      if (typeof defer.resolve !== 'function') {
        throw new Error('missing resolve method for ' + envelope.stamp);
      }
      delete envelope.stamp;
      delete stamp.__deferred[envelope.stamp];
      // TODO handle errors by calling defer.reject
      if (!envelope.payload) {
        throw new Error('missing payload in', envelope);
      }
      console.log('resolving with payload', envelope.payload);
      defer.resolve(envelope.payload);
      console.log('after resolve');
    }, 0);
  }

  console.log('returning payload', envelope);
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
      stamp: String(id)
    };
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
  if (typeof mailman === 'function') {
    return deliver(mailman, address, data);
  } else if (arguments.length === 2 && hasBeenStamped(mailman)) {
    var envelope = mailman;
    console.log('resealing envelope', envelope);
    data = address;
    envelope.payload = data;
    return envelope;
  } else {
    console.log('opening envelope?', mailman);
    if (arguments.length !== 1 ||
      typeof mailman !== 'object') {
      throw new Error('expected just data ' + JSON.stringify(arguments));
    }
    return open(mailman);
  }

  console.log('reached unhandled path', arguments);
  throw new Error('Incorrect stamp');
}

var id = 0;
stamp.__deferred = {};

module.exports = stamp;
