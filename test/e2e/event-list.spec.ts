import type { Page } from '@playwright/test'
import { expect, test } from '@nuxt/test-utils/playwright'
import { assert } from 'es-toolkit'

type Direction = 'backwards' | 'forwards'
type TestArgs = Parameters<Parameters<typeof test.beforeAll>[1]>[0]

let sharedPage: Page | undefined

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

  await sharedPage.goto('/app/space/test/test', { waitUntil: 'domcontentloaded' })
  await expect(sharedPage).not.toHaveURL('/login')
  await expect(sharedPage.getByText('Testing')).toBeVisible()
})

test.afterAll(async () => {
  await sharedPage?.context().close()
})

test.describe('Event list', () => {
  test('paginates backwards', async () => {
    assert(sharedPage, 'sharedPage was undefined on access')

    await paginateUntilBoundary('backwards', sharedPage, 'oldest-event')
  })

  test('paginates forwards from the end', async () => {
    assert(sharedPage, 'sharedPage was undefined on access')

    await paginateUntilBoundary('forwards', sharedPage, 'newest-event')
  })

  test('restore scroll on page load', async () => {
    assert(sharedPage, 'sharedPage was undefined on access')

    await navToRoom(sharedPage, '750')

    const oldContainer = await getScrollContainer(sharedPage)
    await oldContainer.evaluate(el => el.scrollTop = 1024)

    await navToRoom(sharedPage, '250')
    await navToRoom(sharedPage, '750')

    const newContainer = await getScrollContainer(sharedPage)
    await sharedPage.waitForTimeout(2000)
    expect(await newContainer.evaluate(el => el.scrollTop)).toBe(1024)
  })
})

async function paginateUntilBoundary(
  dir: Direction,
  page: TestArgs['page'],
  boundaryId: 'oldest-event' | 'newest-event',
  maxSteps = 200,
) {
  for (let step = 0; step < maxSteps; step++) {
    const current = await getPaginatedEvent(dir, page)

    if (current.id === boundaryId)
      return

    await current.el.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }))

    await expect.poll(async () => {
      const next = await getPaginatedEvent(dir, page)
      return next.id
    }, {
      message: `Boundary did not move after scroll (dir=${dir}, step=${step})`,
      timeout: 2000,
    }).not.toBe(current.id)
  }

  throw new Error(`Did not reach ${boundaryId} within ${maxSteps} steps`)
}

async function navToRoom(page: TestArgs['page'], roomId: string) {
  const tab = page.getByTestId(`mock-room-${roomId}`)
  expect(tab).toBeVisible()

  await tab.click()
  await page.waitForURL(`**\/${roomId}`)
}

async function getScrollContainer(page: TestArgs['page']) {
  return page.getByTestId('scroll-container')
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
