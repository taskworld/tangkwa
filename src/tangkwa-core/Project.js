import t from 'tcomb'

import Feature from './Feature'

export const Project = t.struct({
  features: t.list(Feature),
  stepDefinitions: t.list(t.Any)
})

export default Project
