import * as IDEState from '../tangkwa-core/IDEState'
import * as ScenarioReference from '../tangkwa-core/ScenarioReference'

import { createSelector } from 'reselect'

import generateExecutionPlan from '../tangkwa-core/generateExecutionPlan'

export const PROJECT_LOADED = 'PROJECT_LOADED'
export const PROJECT_LOAD_FAILED = 'PROJECT_LOAD_FAILED'
export const STEP_SELECTED = 'STEP_SELECTED'
export const NAVIGATION = 'NAVIGATION'

export function reducer (state = IDEState.initialState, action) {
  switch (action.type) {
    case PROJECT_LOADED:
      return IDEState.handleProjectLoaded(action.project)(state)
    case PROJECT_LOAD_FAILED:
      return IDEState.handleProjectLoadFailed(action.error)(state)
    case NAVIGATION:
      return IDEState.handleScenarioSelected(ScenarioReference.parseFromLocation(action.location))(state)
    case STEP_SELECTED:
      return IDEState.handleStepSelected(action.stepId)(state)
    default:
      return state
  }
}

export const selectProject = (state) => state.project
export const selectProjectLoadError = (state) => state.projectLoadError
export const selectSelectedScenario = (state) => state.selectedScenario
export const selectSelectedStepId = (state) => state.selectedStepId

export const selectExecutionPlan = createSelector(
  selectProject,
  selectSelectedScenario,
  (project, ref) => {
    if (!project || !ref) return null
    return generateExecutionPlan(project, ref)
  }
)
