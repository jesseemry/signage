const swVersion = '1.0.01';
console.log('sw v#',swVersion);
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('signageApp')
        .then(cache => {
            return cache.addAll([
                '/signage/',
                'index.html',
                'Stylesheet.css'
            ]);
        })
    );
});

// (async () => {
//     importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-window.prod.v6.5.4.js');
    
//     const registration = await workbox.core.clientsClaim();
//     const clientsClaim = await registration.waitUntil(
//         self.clients.claim()
//     );
//     self.addEventListener('online', () => {
//         console.log('online')
//         clients.matchAll().then(clients => {
//             clients.forEach(client => {
//                 client.postMessage('refresh');
//             });
//         });
//     });
//     })();

// self.addEventListener('online', () => {
//     console.log('online')
//     loadContent()
//     // clients.matchAll().then(clients => {
//     //     clients.forEach(client => {
//     //         client.postMessage('refresh');
//     //     });
//     // });
// });

// self.addEventListener('offline', () => {
//     console.log('offline')
// });
