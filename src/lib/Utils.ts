export function lerp(v0: number, v1: number, t: number) {
  return ((1 - t) * v0) + (t * v1);
}


export function throttle(callback: Function, limit: number) {
  var wait = false;                  // Initially, we're not waiting
  return function () {               // We return a throttled function
    if (!wait) {                   // If we're not waiting
      callback();           // Execute users function
      wait = true;               // Prevent future invocations
      setTimeout(function () {   // After a period of time
        wait = false;          // And allow future invocations
      }, limit);
    }
  }
}