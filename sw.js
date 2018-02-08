<!-- START: {Adding Service Worker} {3} out of {3} -->
importScripts('workbox-sw.prod.v2.1.2.js');
const workboxSW = new WorkboxSW();
workboxSW.precache([
  {
    "url": "bundle.js",
    "revision": "db6299de247ce713ee284fccc0bb8613"
  },
  {
    "url": "index.html",
    "revision": "8a483be9eb7c2d44ca36ee0d9704ddbe"
  },
  {
    "url": "main.css",
    "revision": "02ae2deab00fde78ec4b9ba2285a54ab"
  },
  {
    "url": "workbox-sw.prod.v2.1.2.js",
    "revision": "685d1ceb6b9a9f94aacf71d6aeef8b51"
  }
]);
<!-- END: {Adding Service Worker} {3} out of {3} -->

<!-- START: {Adding Service Worker} {1} out of {3} -->
self.addEventListener('install', function (event) {
  console.log('%c ServiceWorker install method', 'color: #FF5722');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  console.log('%c ServiceWorker activate method', 'color: #CDDC39');
  event.waitUntil(self.clients.claim());
});
<!-- END: {Adding Service Worker} {1} out of {3} -->

<!-- START: {Adding Sync} {1} out of {2} -->
self.addEventListener('message', function(event){
  console.log("SW Received Message: " + event.data);
  if(event.data[0].eventName === 'upvote') {
    self.upvoteUrl = event.data[0].url;
    self.upvoteRequestItem = event.data[0].requestItem;
  }
});

self.addEventListener('sync', event => {
  if (event.tag == 'upvoteSync') {
    event.waitUntil(
      fetch(self.upvoteUrl, self.upvoteRequestItem)
      .then(res => res.json())
      .then(res => console.log)
      .catch(e => console.log)
    );
  }
});
<!-- END: {Adding Sync} {1} out of {2} -->


<!-- START: {Caching files} {1} out of {1} -->
workboxSW.router.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/,
  workboxSW.strategies.cacheFirst({
    cacheName: 'googleapis',
    cacheExpiration: {
      maxEntries: 30
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);
workboxSW.router.registerRoute(/.*(?:cdnjs)(?:\.cloudflare)\.com*/,
  workboxSW.strategies.cacheFirst({
    cacheName: 'cdnjs',
    cacheExpiration: {
      maxEntries: 30
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);

workboxSW.router.registerRoute(/.*\/api\/search*/,
  workboxSW.strategies.cacheFirst({
    cacheName: 'user',
    cacheExpiration: {
      maxEntries: 30
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);
<!-- END:  {Caching files} {1} out of {1} -->

<!-- START: {Add to homescreen banner } {1} out of {1} -->
self.addEventListener('beforeinstallprompt', function(e) {
  console.log('%c beforeinstallprompt Event fired', 'color: #ff00ff', e.platforms);
  e.userChoice.then(function(choiceResult) {

    console.log(choiceResult.outcome);

    if(choiceResult.outcome == 'dismissed') {
      console.log('%c User cancelled home screen install', 'color: #FF5722');
    }
    else {
      console.log('%c User added to home screen', 'color: #00ff00');
    }
  });
});
<!-- END: {Add to homescreen banner } {1} out of {1} -->
