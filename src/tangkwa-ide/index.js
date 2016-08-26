
const projectModule = require('__project__')
console.log(projectModule)

if (module.hot) {
  module.hot.accept('__project__', () => {
    console.log('Got project module:', require('__project__'))
  })
}

const createStep = (project) => (stepName) => {
  const isMatching = (stepDefinition) => stepDefinition.stepName === stepName
  const matching = project.stepDefinitions.filter(isMatching)
  if (matching.length === 1) {
    return { stepName, ...matching[0].createOptions() }
  }
  return null
}

const steps = [
  createStep(projectModule)('I am on Google'),
  createStep(projectModule)('I search for Taskworld'),
  createStep(projectModule)('the first result should link to Taskworld home page')
]

function createRunner () {
  let _context = { }
  return {
    async run (step) {
      console.log('[Runner] Running', step.stepName, 'with context', _context)
      const el = document.createElement('div')
      el.textContent = step.stepName
      el.style.color = '#f7f'
      document.body.appendChild(el)
      try {
        const nextContext = (await step.run(_context))
        if (nextContext) {
          console.log('[Runner] Next context is', nextContext)
          _context = nextContext
        }
        el.style.color = '#8c8'
      } catch (e) {
        el.style.color = '#c44'
        const errorEl = document.createElement('pre')
        errorEl.textContent = String(e.stack)
        el.appendChild(errorEl)
        throw e
      }
    }
  }
}

async function testIt () {
  const runner = createRunner()
  try {
    for (const step of steps) await runner.run(step)
  } finally {
    await runner.run({
      stepName: 'Clean up',
      run: projectModule.cleanUp
    })
  }
}

Object.assign(window, { testIt })
