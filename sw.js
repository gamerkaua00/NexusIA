const CACHE_NAME = 'pwa-cache-v1';
// Arquivos essenciais para o funcionamento offline
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    // Adicione seus arquivos CSS e JS críticos aqui
    // '/styles/main.css',
    // '/scripts/app.js' 
];

// Instalação: Abre o cache e adiciona todos os arquivos estáticos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto: Adicionando recursos estáticos.');
                return cache.addAll(urlsToCache);
            })
    );
});

// Ativação: Limpa caches antigos (para garantir que a nova versão funcione)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Limpando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch: Intercepta requisições e serve do cache, se disponível
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna a resposta do cache, se encontrada
                if (response) {
                    return response;
                }
                // Se não estiver no cache, faz a requisição normal
                return fetch(event.request);
            })
    );
});
