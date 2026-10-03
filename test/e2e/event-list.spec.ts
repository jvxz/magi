import type { Locator, Page } from 'playwright-core'

import { assert } from 'es-toolkit'
import { randomInt } from 'es-toolkit/math'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { mockLogin, newPage, setFlag } from './utils'

type Direction = 'backwards' | 'forwards'

let sharedPage: Page | undefined

beforeAll(async () => {
  sharedPage = await newPage({ serviceWorkers: 'block' })

  await setFlag(sharedPage.context(), 'skip-auth-middleware', true)
  await mockLogin(sharedPage)

  await sharedPage.goto('/app/space/test/test', { waitUntil: 'domcontentloaded' })
  expect(sharedPage.url()).not.toContain('/login')
  await sharedPage.getByText('Testing').waitFor()
})

afterAll(async () => {
  await sharedPage?.close()
})

describe('event list', () => {
  it('does not paginate from layout changes', { timeout: 15_000 }, async () => {
    assert(sharedPage, 'sharedPage was undefined on access')

    await sharedPage.goto('/app/space/test/303', { waitUntil: 'domcontentloaded' })
    const container = getScrollContainer(sharedPage)
    await container.waitFor({ timeout: 15_000 })

    const style = await sharedPage.addStyleTag({
      content: `
        [data-testid="scroll-container"] { height: 400px !important; }
        [data-item-id] { height: 4px !important; min-height: 0 !important; overflow: hidden !important; }
      `,
    })

    await expect.poll(() => container.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true)

    await container.evaluate(el => (el.scrollTop = 0))
    await expect
      .poll(() => getPaginatedEvent('backwards', sharedPage!).then(event => event.id), { timeout: 2000 })
      .toBe('oldest-event')

    const backwardSamples = await sampleWindow(container)
    expect(new Set(backwardSamples.map(({ first, last }) => `${first}:${last}`)).size).toBe(1)

    await container.evaluate(el => (el.scrollTop = el.scrollHeight))
    await expect
      .poll(() => getPaginatedEvent('forwards', sharedPage!).then(event => event.id), { timeout: 2000 })
      .toBe('newest-event')

    const forwardSamples = await sampleWindow(container)
    expect(new Set(forwardSamples.map(({ first, last }) => `${first}:${last}`)).size).toBe(1)

    await style.evaluate(el => (el as Element).remove())
    await sharedPage.goto('/app/space/test/test', { waitUntil: 'domcontentloaded' })
    await getScrollContainer(sharedPage).waitFor({ timeout: 15_000 })
  })

  it('paginates backwards', async () => {
    assert(sharedPage, 'sharedPage was undefined on access')

    await paginateUntilBoundary('backwards', sharedPage, 'oldest-event')
  })

  it('paginates forwards from the end', async () => {
    assert(sharedPage, 'sharedPage was undefined on access')

    await paginateUntilBoundary('forwards', sharedPage, 'newest-event')
  })

  it('restore scroll on page load', async () => {
    assert(sharedPage, 'sharedPage was undefined on access')

    await navToRoom(sharedPage, '750')

    const oldContainer = getScrollContainer(sharedPage)

    const maxScroll = await oldContainer.evaluate(el => el.scrollHeight - el.clientHeight)
    const scrollTopVal = randomInt(maxScroll * 0.25, maxScroll * 0.9)

    await oldContainer.evaluate((el, value) => (el.scrollTop = value), scrollTopVal)

    await navToRoom(sharedPage, '250')
    await navToRoom(sharedPage, '750')

    const newContainer = getScrollContainer(sharedPage)
    await newContainer.waitFor({ timeout: 15_000 })
    await expect
      .poll(() => newContainer.evaluate((el: HTMLElement) => el.scrollTop), { timeout: 10_000 })
      .toBe(scrollTopVal)
  })
})

async function paginateUntilBoundary(
  dir: Direction,
  page: Page,
  boundaryId: 'oldest-event' | 'newest-event',
  maxSteps = 200,
) {
  for (let step = 0; step < maxSteps; step++) {
    const current = await getPaginatedEvent(dir, page)

    if (current.id === boundaryId) return

    await current.el.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }))

    await expect
      .poll(
        async () => {
          const next = await getPaginatedEvent(dir, page)
          return next.id
        },
        {
          message: `Boundary did not move after scroll (dir=${dir}, step=${step})`,
          timeout: 2000,
        },
      )
      .not.toBe(current.id)
  }

  throw new Error(`Did not reach ${boundaryId} within ${maxSteps} steps`)
}

async function navToRoom(page: Page, roomId: string) {
  const tab = page.getByTestId(`mock-room-${roomId}`)
  await tab.waitFor()

  await tab.click()
  await page.waitForURL(`**/${roomId}`)
  await page.getByTestId('scroll-container').waitFor({ timeout: 15_000 })
}

function getScrollContainer(page: Page) {
  return page.getByTestId('scroll-container')
}

async function sampleWindow(container: Locator) {
  return container.evaluate(async el => {
    const samples: { first?: string; last?: string }[] = []

    for (let i = 0; i < 20; i++) {
      const rows = [...el.querySelectorAll<HTMLElement>('[data-item-id]')]
      samples.push({
        first: rows[0]?.dataset.itemId,
        last: rows.at(-1)?.dataset.itemId,
      })
      await new Promise(resolve => setTimeout(resolve, 25))
    }

    return samples
  })
}

async function getScrollContainerEvents(page: Page) {
  const wrapper = page.getByTestId('scroll-container-wrapper')
  return wrapper.locator('[data-index]')
}

async function getPaginatedEvent(dir: Direction, page: Page) {
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
