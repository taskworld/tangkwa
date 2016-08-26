'use strict'

const t = require('tcomb')
const uuid = require('uuid')

module.exports = function (app) {
  app.use('/webdriver', seleniumServer())
}

function seleniumServer () {
  const express = require('express')
  const router = express.Router()
  const webdriverio = require('webdriverio')
  const clients = new Map()

  router.post('/clients', function (req, res, next) {
    const options = req.body.options
    const client = webdriverio.remote(options)
    const clientId = uuid.v4()
    clients.set(clientId, client)
    res.json({ clientId })
  })

  const types = {
    selector: t.String,
    selectors: t.union([ t.String, t.list(String) ]),
    value: t.union([ t.String, t.Number ])
  }

  const methods = {
    // WebDriver commands
    addValue: [ types.selector, types.value ],
    clearElement: [ types.selector ],
    click: [ types.selector ],
    doubleClick: [ types.selector ],
    dragAndDrop: [ types.selector, types.selector ],
    leftClick: [ types.selector, t.Number, t.Number ],
    middleClick: [ types.selector, t.Number, t.Number ],
    moveToObject: [ types.selector, t.Number, t.Number ],
    rightClick: [ types.selector, t.Number, t.Number ],
    selectByAttribute: [ types.selector, t.String, t.String ],
    selectByIndex: [ types.selector, t.Number ],
    selectByValue: [ types.selector, t.String ],
    selectByVisibleText: [ types.selector, t.String ],
    selectorExecute: [ types.selectors, t.String ],
    selectorExecuteAsync: [ types.selectors, t.String ],
    setValue: [ types.selector, types.value ],
    submitForm: [ types.selector ],

    // Properties
    getAttribute: [ types.selector, t.String ],
    getCssProperty: [ types.selector, t.String ],
    getElementSize: [ types.selector ],
    getHTML: [ types.selector ],
    getLocation: [ types.selector ],
    getLocationInView: [ types.selector ],
    getSource: [ ],
    getTagName: [ types.selector ],
    getText: [ types.selector ],
    getTitle: [ types.selector ],
    getUrl: [ types.selector ],
    getValue: [ types.selector ],

    // Protocol
    execute: [ t.String ],
    executeAsync: [ t.String ],
    init: [ ],
    end: [ ],
    keys: [ t.union([ t.String, t.list(t.String) ]) ],
    url: [ t.String ]
  }

  router.post('/clients/:clientId/commands', function (req, res, next) {
    const clientId = t.String(req.params.clientId)
    const methodName = t.String(req.body.method)
    const client = clients.get(clientId)
    if (!client) {
      return res.status(404).json({ error: `clientId ${clientId} not found.` })
    }
    const method = methods[methodName]
    const params = t.tuple(method)(req.body.params)
    client[methodName](...params).then((result) => {
      try {
        res.json(result)
      } catch (e) {
        next(e)
      }
    }, next)
  })

  return router
}
