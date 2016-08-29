import t from 'tcomb'

const Location = t.struct({
  column: t.Number,
  line: t.Number
}, { name: 'Location' })

const Steps = t.list(t.struct({
  keyword: t.String,
  text: t.String,
  location: t.maybe(Location)
}, { name: 'Step' }))

export const Scenario = t.struct({
  name: t.String,
  steps: Steps,
  location: t.maybe(Location)
}, { name: 'Scenario' })

export const Background = t.struct({
  steps: Steps,
  location: t.maybe(Location)
}, { name: 'Background' })

export const Feature = t.struct({
  name: t.String,
  filename: t.String,
  description: t.maybe(t.String),
  background: t.maybe(Background),
  location: t.maybe(Location),
  scenarios: t.list(Scenario)
}, { name: 'Feature' })

export default Feature
