import { IndexedDBStoreWorker } from 'matrix-js-sdk/lib/indexeddb-worker'

const worker = new IndexedDBStoreWorker(postMessage.bind(globalThis))
onmessage = worker.onMessage.bind(worker)
