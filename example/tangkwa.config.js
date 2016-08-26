import * as Browser from './Browser'

import assert from 'assert'
import t from 'tcomb'
import { createStepDefinition } from 'tangkwa-steps'

export const stepDefinitions = [
  createStepDefinition('I am on Google', () => ({
    nextContextTypes: {
      browser: t.Any
    },
    async run (context) {
      const browser = await Browser.create({ browserName: 'chrome' })
      await Browser.init(browser)
      await Browser.url('https://www.google.com/')(browser)
      return { browser }
    }
  })),
  createStepDefinition('I search for Taskworld', () => ({
    contextTypes: {
      browser: t.Any
    },
    async run (context) {
      const browser = context.browser
      await Browser.setValue('input[name="q"]', 'Taskworld')(browser)
    }
  })),
  createStepDefinition('the first result should link to Taskworld home page', () => ({
    contextTypes: {
      browser: t.Any
    },
    async run (context) {
      const browser = context.browser
      const [ href ] = await until(() => Browser.getAttribute('#ires a', 'href')(browser))
      assert.equal(href, 'https://taskworld.com/')
    }
  }))
]

export async function cleanUp (context) {
  if (context.browser) {
    await Browser.end(context.browser)
  }
}

async function until (predicate) {
  let wait = 100
  const start = Date.now()
  for (;;) {
    try {
      return await predicate()
    } catch (e) {
      const elapsed = Date.now() - start
      if (elapsed > 15000) {
        throw e
      } else {
        await new Promise((resolve) => {
          setTimeout(resolve, wait)
          wait *= 2
        })
      }
    }
  }
}
