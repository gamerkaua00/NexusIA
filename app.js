
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('NeuroNexus SW: ServiceWorker registrado com sucesso:', registration.scope);
      })
      .catch(error => {
        console.error('NeuroNexus SW: Falha no registro do ServiceWorker:', error);
      });
  });
}
