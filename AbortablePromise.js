function makePromise(origPromise, timeout) {
  const promises = [origPromise];
  if (timeout > 0) {
    promises.push(_timeoutPromise(timeout));
  }
  let abortPromise = null;
  promises.push(new Promise((resolve, reject) => {
    abortPromise = reject;
  }));

  const ret = Promise.race(promises);
  ret.abort = abortPromise;
  return ret;
}

function _timeoutPromise(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('timeout'), timeout);
  });
}

export default makePromise;

if (process.env.NODE_ENV === 'development') {
  const origPromise = new Promise(resolve => setTimeout(() => resolve('done'), 5000));
  const abortablePromise = makePromise(origPromise, 6000);
  abortablePromise
  .then(done => console.log('promise resolved, result: ', done))
  .catch(error => console.warn('promise not resolved, error: ', error));

  setTimeout(() => abortablePromise.abort('aborted'), 6000);
}
