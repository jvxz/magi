export async function getServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  await withTimeout(() => navigator.serviceWorker.ready, 2000)

  return navigator.serviceWorker
}

export async function messageSw<T extends SwMessageType>(type: T, payload: SwMessagePayload<T>) {
  if (import.meta.server) return

  const sw = await getServiceWorker()
  if (!sw || !sw.controller) return

  sw.controller.postMessage({
    payload,
    type,
  })
}
