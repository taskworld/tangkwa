import * as IDEState from '../tangkwa-core/IDEState'
import * as ScenarioReference from '../tangkwa-core/ScenarioReference'

export const PROJECT_LOADED = 'PROJECT_LOADED'
export const PROJECT_LOAD_FAILED = 'PROJECT_LOAD_FAILED'
export const NAVIGATION = 'NAVIGATION'

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
