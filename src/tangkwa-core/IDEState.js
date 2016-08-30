import u from 'updeep'

export const initialState = {
  project: null,
  projectLoadError: null,
  selectedScenario: null,
  selectedStepId: null
}

export const handleProjectLoaded = (project) => u({ project: () => project })
export const handleProjectLoadFailed = (error) => u({ projectLoadError: () => error })
export const handleScenarioSelected = (scenarioReference) => u({ selectedScenario: () => scenarioReference })
export const handleStepSelected = (stepId) => u({ selectedStepId: stepId })
