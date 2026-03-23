export async function sendSessionToSw(baseUrl?: string, accessToken?: string) {
  if (import.meta.server)
    return

  const sw = await getServiceWorker()
  if (!sw || !sw.controller)
    return

  sw.controller.postMessage({
    payload: {
      accessToken,
      baseUrl,
    },
    type: 'session',
  })
}
