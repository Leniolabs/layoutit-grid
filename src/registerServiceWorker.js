export function registerServiceWorker() {
  if('serviceWorker' in navigator) {
  navigator.serviceWorker
    // Register script located at public/listsw.js
    .register('./litsw.js')
    .then(reg => {console.log(`Service worker for layoutit: ${reg.scope}`)})
    .catch(err => console.log(`Error registring service worker: ${err}`))
  }
}
