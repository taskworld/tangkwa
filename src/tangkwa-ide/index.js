import 'normalize.css'

import './body.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import history from './history'
import { reducer, PROJECT_LOADED, PROJECT_LOAD_FAILED, NAVIGATION } from './redux'

const store = createStore(reducer, window.devToolsExtension && window.devToolsExtension())

function loadProject () {
  try {
    const projectModule = require('__project__')
    store.dispatch({
      type: PROJECT_LOADED,
      project: projectModule
    })
  } catch (e) {
    store.dispatch({
      type: PROJECT_LOAD_FAILED,
      error: e
    })
  }
}

if (module.hot) {
  module.hot.accept('__project__', loadProject)
}

loadProject()

function renderApp () {
  const { App } = require('./view')
  const element = (
    <Provider store={store}><App /></Provider>
  )
  const container = document.querySelector('#tangkwa-ide') || (() => {
    const div = document.createElement('div')
    div.id = 'tangkwa-ide'
    document.body.appendChild(div)
    return div
  })()
  ReactDOM.render(element, container)
}

renderApp()

if (module.hot) {
  module.hot.accept('./view', renderApp)
}

history.listen((location) => {
  store.dispatch({ type: NAVIGATION, location: location })
})

store.dispatch({ type: NAVIGATION, location: history.getCurrentLocation() })

// const createStep = (project) => (stepName) => {
//   const isMatching = (stepDefinition) => stepDefinition.stepName === stepName
//   const matching = project.stepDefinitions.filter(isMatching)
//   if (matching.length === 1) {
//     return { stepName, ...matching[0].createOptions() }
//   }
//   return null
// }
//
// function createRunner () {
//   let _context = { }
//   return {
//     async run (step) {
//       console.log('[Runner] Running', step.stepName, 'with context', _context)
//       const el = document.createElement('div')
//       el.textContent = step.stepName
//       el.style.color = '#f7f'
//       document.body.appendChild(el)
//       try {
//         const nextContext = (await step.run(_context))
//         if (nextContext) {
//           console.log('[Runner] Next context is', nextContext)
//           _context = nextContext
//         }
//         el.style.color = '#8c8'
//       } catch (e) {
//         el.style.color = '#c44'
//         const errorEl = document.createElement('pre')
//         errorEl.textContent = String(e.stack)
//         el.appendChild(errorEl)
//         throw e
//       }
//     }
//   }
// }
//
// async function testIt () {
//   const runner = createRunner()
//   try {
//     for (const step of steps) await runner.run(step)
//   } finally {
//     await runner.run({
//       stepName: 'Clean up',
//       run: projectModule.cleanUp
//     })
//   }
// }
//
// Object.assign(window, { testIt })
