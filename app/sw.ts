// https://github.com/vite-pwa/nuxt/blob/main/playground/service-worker/sw.ts

/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { CacheFirst } from 'workbox-strategies'
import { SwMessageSchema } from './constants/sw-messages'

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
  const res = SwMessageSchema.safeParse(e.data)
  if (!res.success)
    return console.warn('Unknown message sent to service worker: ', e.data)

  const { payload, type } = res.data

  switch (type) {
    case 'session': {
      activeSession = {
        accessToken: payload.accessToken ?? undefined,
        baseUrl: payload.baseUrl ?? undefined,
      }
    }
  }
})

const MEDIA_PATHS = ['/_matrix/client/v1/media/download/', '/_matrix/client/v1/media/thumbnail/']

const matrixMediaStrategy = new CacheFirst({
  cacheName: 'media',
  plugins: [
    {
      requestWillFetch: async ({ request }) => {
        if (!activeSession || !activeSession.accessToken)
          return request

        const headers = new Headers(request.headers)
        headers.set('Authorization', `Bearer ${activeSession.accessToken}`)

        return new Request(request.url, { ...request, headers })
      },
    },
    new ExpirationPlugin({
      maxAgeSeconds: 3600,
    }),
  ],
})

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
  if (isMediaRequest(e.request))
    return e.respondWith(matrixMediaStrategy.handle(e))
})
