import { expect, test } from '@nuxt/test-utils/playwright'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('magi:test:auth', JSON.stringify({
      accessToken: 'fake-token',
      deviceId: 'TEST_DEVICE',
      userId: '@test:localhost',
    }))
  })
})

test.describe('Event list', () => {
  test('paginates backwards', async ({ goto, page }) => {
    await loadRoomPage(page, goto)

    let e = await paginate('backward', page)
    while (e) {
      const res = await paginate('backward', page)
      if (res)
        e = res
      else break
    }

    expect(e).toBeDefined()
    expect(e?.id).toBe('oldest-event')

    await page.pause()
  })
})

type TestArgs = Parameters<Parameters<typeof test.beforeAll>[1]>[0]

async function loadRoomPage(page: TestArgs['page'], goto: TestArgs['goto']) {
  await goto('/app/space/test/test', { waitUntil: 'hydration' })
  await expect(page).not.toHaveURL('/login')
  await expect(page.getByText('Testing')).toBeVisible()
}

async function getScrollContainer(page: TestArgs['page']) {
  return page.locator('.scroll-container')
}

async function getScrollContainerEvents(page: TestArgs['page']) {
  const wrapper = page.getByTestId('scroll-container-wrapper')
  return wrapper.locator('[data-index]')
}

async function getOldestPaginatedEvent(page: TestArgs['page']) {
  const events = await getScrollContainerEvents(page)

  const el = events.first()
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

async function paginate(dir: 'backward' | 'forward', page: TestArgs['page']) {
  const container = await getScrollContainer(page)
  await container.hover()

  const prevEvent = await getOldestPaginatedEvent(page)
  await prevEvent.el.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }))

  const scrollHeight = await container.evaluate(el => el.scrollHeight)

  const threshold = 139
  expect(Math.abs(scrollHeight - 7000)).toBeLessThanOrEqual(threshold)

  const nextEvent = await getOldestPaginatedEvent(page)

  if (nextEvent.id !== prevEvent.id)
    return nextEvent
}
