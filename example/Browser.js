import { post } from 'axios'

export async function create (options) {
  console.log('[Browser] Creating browser with options', options)
  const response = await post('/webdriver/clients', { options })
  const clientId = response.data.clientId
  return { clientId }
}

const remoteCall = (methodName) => (...params) => async (browser) => {
  console.log('[Browser] Running command', methodName, 'with args', params)
  try {
    const { data } = await post(`/webdriver/clients/${browser.clientId}/commands`, {
      method: methodName,
      params: params
    })
    return data
  } catch (e) {
    throw new Error('WebDriver server error: ' + require('util').inspect(e.response.data))
  }
}

export const init = remoteCall('init')()
export const url = remoteCall('url')
export const setValue = remoteCall('setValue')
export const getAttribute = remoteCall('getAttribute')
export const click = remoteCall('click')
export const end = remoteCall('end')()
export const submitForm = remoteCall('submitForm')
