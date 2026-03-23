export async function getServiceWorker() {
  if (!('serviceWorker' in navigator))
    return

  await navigator.serviceWorker.ready

  return navigator.serviceWorker
}
