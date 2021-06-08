const CACHE_NAME = 'layoutit-cache-v2'

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') {
    e.respondWith(fetch(e.request));
    return;
  }
  // Intercept fetch to add offline behavior
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // clone response to store it (always store latest)
        const resClone = res.clone()
        caches.open(CACHE_NAME)
          .then(cache => {
            // Add response to cache
            cache.put(e.request, resClone)
          })
        return res
      })
      .catch(err => {
        // Runs if there's no connection or network error
        return caches
          // returns a matching cache record or undefined
          .match(e.request)
          .then(res => res
            // opportunity to show an offline page (should store it at install event)
            //|| caches.match('/offline.html').then(res => res)
          )
      })
  )
})
