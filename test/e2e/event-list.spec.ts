import type { Page } from '@playwright/test'
import { expect, test } from '@nuxt/test-utils/playwright'

type Direction = 'backwards' | 'forwards'
type TestArgs = Parameters<Parameters<typeof test.beforeAll>[1]>[0]
type MockEvent = Awaited<ReturnType<typeof getPaginatedEvent>>

let sharedPage: Page
let oldestEvent: MockEvent | undefined

test.describe.configure({ mode: 'serial' })

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext()
  sharedPage = await context.newPage()

  await sharedPage.addInitScript(() => {
    window.localStorage.setItem('magi:test:auth', JSON.stringify({
      accessToken: 'fake-token',
      deviceId: 'TEST_DEVICE',
      userId: '@test:localhost',
    }))
  })

  await sharedPage.goto('/app/space/test/test', { waitUntil: 'networkidle' })
  await expect(sharedPage).not.toHaveURL('/login')
  await expect(sharedPage.getByText('Testing')).toBeVisible()
})

test.afterAll(async () => {
  await sharedPage.context().close()
})

test.describe('Event list', () => {
  test('paginates backwards', async () => {
    let e = await paginate('backwards', sharedPage)
    while (e) {
      const res = await paginate('backwards', sharedPage)
      if (res)
        e = res
      else break
    }

    expect(e).toBeDefined()
    expect(e?.id).toBe('oldest-event')

    oldestEvent = e
  })

  test('paginates forwards from the end', async () => {
    expect(oldestEvent).toBeDefined()

    let e = await paginate('forwards', sharedPage)
    while (e) {
      const res = await paginate('forwards', sharedPage)
      if (res)
        e = res
      else break
    }

    expect(e).toBeDefined()
    expect(e?.id).toBe('newest-event')

    await sharedPage.pause()
  })
})

async function paginate(dir: Direction, page: TestArgs['page']) {
  const container = await getScrollContainer(page)
  await container.hover()

  const prevEvent = await getPaginatedEvent(dir, page)
  await prevEvent.el.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }))

  expect.soft(await prevEvent.el.evaluate(el => el.children.length)).toBeLessThanOrEqual(80)

  const nextEvent = await getPaginatedEvent(dir, page)

  if (nextEvent.id !== prevEvent.id)
    return nextEvent
}

async function getScrollContainer(page: TestArgs['page']) {
  return page.locator('.scroll-container')
}

async function getScrollContainerEvents(page: TestArgs['page']) {
  const wrapper = page.getByTestId('scroll-container-wrapper')
  return wrapper.locator('[data-index]')
}

async function getPaginatedEvent(dir: Direction, page: TestArgs['page']) {
  const events = await getScrollContainerEvents(page)

  const el = dir === 'backwards' ? events.first() : events.last()
  expect(el).toBeTruthy()

  const id = await el.getAttribute('data-item-id')
  const index = await el.getAttribute('data-index')
  expect(id).toBeTruthy()
  expect(index).toBeTruthy()

  return {
    el,
    id,
    index,
  }
}
