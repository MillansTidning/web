
// ==========================================
// FIREBASE – PUSHNOTISER FÖR MILLANS TIDNING
// ==========================================

importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCztFT4yGoEvDrPmxS4WwZjRqwtcRy_K_A",
  authDomain: "millans-tidning.firebaseapp.com",
  projectId: "millans-tidning",
  storageBucket: "millans-tidning.firebasestorage.app",
  messagingSenderId: "661191163803",
  appId: "1:661191163803:web:cc1406ed3ebea95552eb3e",
  measurementId: "G-ZT86YGNW6C"
});

const messaging = firebase.messaging();

// Ta emot notiser i bakgrunden
messaging.onBackgroundMessage((payload) => {

  // Visa bara manuella notiser när meddelandet saknar notification-fält.
  if (payload.notification) return;

  const title = payload.data?.title || "Millans Tidning";

  const options = {
    body: payload.data?.body || "Något nytt har hänt på MT! 😸",
    icon: "/web/icon-192.png",
    badge: "/web/icon-192.png",
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});

// Vad händer när man trycker på notisen?
self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  const target = event.notification.data?.url || "/web/home.html";

  event.waitUntil(
    clients.openWindow(target)
  );
});


// ==========================================
// CACHE FÖR MILLANS TIDNING
// ==========================================

const CACHE_NAME = "millans-tidning-v2";

const FILES_TO_CACHE = [
  "/web/home.html",
  "/web/style.css",
  "/web/logga.png",
  "/web/icon-192.png",
  "/web/icon-512.png",
  "/web/manifest.json"
];


// Installera service worker
self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});


// Aktivera service worker
self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});


// Hantera hämtning av filer
self.addEventListener("fetch", event => {

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );

});
