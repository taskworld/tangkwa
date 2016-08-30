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
