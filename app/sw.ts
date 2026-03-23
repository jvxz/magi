// https://github.com/vite-pwa/nuxt/blob/main/playground/service-worker/sw.ts

/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

self.skipWaiting()
clientsClaim()

let activeSession: {
  baseUrl?: string
  accessToken?: string
} | undefined

self.addEventListener('message', (e) => {
  if (e.data.type === 'session') {
    return activeSession = {
      accessToken: e.data.payload.accessToken,
      baseUrl: e.data.payload.baseUrl,
    }
  }
})

const MEDIA_PATHS = ['/_matrix/client/v1/media/download/', '/_matrix/client/v1/media/thumbnail/']
function isMediaRequest(req: Request) {
  try {
    const { hostname: reqHostname, pathname } = new URL(req.url)
    const { hostname: baseHostname } = new URL(activeSession?.baseUrl ?? '')
    return MEDIA_PATHS.some(path => pathname.startsWith(path))
      && reqHostname === baseHostname
      && req.method === 'GET'
  }
  catch {
    return false
  }
}

self.addEventListener('fetch', (e) => {
  if (isMediaRequest(e.request)) {
    const res = async () => {
      if (!activeSession || !activeSession.accessToken)
        return fetch(e.request)

      const headers = new Headers(e.request.headers)
      headers.set('Authorization', `Bearer ${activeSession.accessToken}`)

      const req = new Request(e.request.url, { ...e.request, headers })

      return fetch(req)
    }

    return e.respondWith(res())
  }
})
