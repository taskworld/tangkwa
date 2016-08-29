import * as ScenarioReference from './ScenarioReference'

import u from 'updeep'

export const PROJECT_LOADED = 'PROJECT_LOADED'
export const PROJECT_LOAD_FAILED = 'PROJECT_LOAD_FAILED'
export const SCENARIO_SELECTED = 'SCENARIO_SELECTED'
export const NAVIGATION = 'NAVIGATION'

const IDEState = {
  initialState: {
    project: null,
    projectLoadError: null,
    selectedScenario: null
  },
  handleProjectLoaded: (project) => u({ project: () => project }),
  handleProjectLoadFailed: (error) => u({ projectLoadError: () => error }),
  handleScenarioSelected: (scenarioReference) => u({ selectedScenario: () => scenarioReference })
}

export function reducer (state = IDEState.initialState, action) {
  switch (action.type) {
    case PROJECT_LOADED:
      return IDEState.handleProjectLoaded(action.project)(state)
    case PROJECT_LOAD_FAILED:
      return IDEState.handleProjectLoadFailed(action.error)(state)
    case NAVIGATION:
      return IDEState.handleScenarioSelected(ScenarioReference.parseFromLocation(action.location))(state)
    default:
      return state
  }
}
