export async function getServiceWorker() {
  if (!('serviceWorker' in navigator))
    return

  await withTimeout(() => navigator.serviceWorker.ready, 2000)

  return navigator.serviceWorker
}
