const CACHE_NAME = 'neuro-nexus-v5-cache';
const urlsToCache = [
    './', 
    './index.html',
    // Recursos externos essenciais
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js'
];

self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching application shell');
                // Tenta fazer cache, mas não falha a instalação se um recurso externo falhar
                return cache.addAll(urlsToCache).catch(err => console.warn('Alguns recursos não foram cacheados:', err));
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activated & Claiming clients');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Estratégia: Cache primeiro, depois Rede
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Se estiver no cache, retorna
                if (response) {
                    return response;
                }
                // Se não, busca na rede
                return fetch(event.request).catch(() => {
                    // Fallback para quando estiver totalmente offline e tentar navegar
                    if (event.request.mode === 'navigate') {
                        return new Response("<h1>Offline Mode</h1><p>NeuroNexus está em modo offline. Verifique sua conexão.</p>", { 
                            status: 200, 
                            headers: {'Content-Type': 'text/html'} 
                        });
                    }
                });
            })
    );
});