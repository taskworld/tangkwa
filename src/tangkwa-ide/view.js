import * as ScenarioReference from './ScenarioReference'

import React from 'react'
import { connect } from 'react-redux'

import history from './history'
import { SCENARIO_SELECTED } from './redux'

const absolute = { position: 'absolute' }
const resetBox = { margin: 0, padding: 0 }
const inset = (px) => ({ ...absolute, top: px, right: px, bottom: px, left: px })
const fill = inset(0)

const SPACING_SMALL = 8
const SIDEBAR_WIDTH = 320

export const App = () => (
  <div>
    <div style={inset(SPACING_SMALL)}>
      <div style={{ ...absolute, top: 0, width: SIDEBAR_WIDTH, bottom: 0, left: 0 }}>
        <Panel title='Pick a Scenario!!!!!!'>
          <ScenarioList />
        </Panel>
      </div>
      <div style={{ ...absolute, top: 0, right: 0, bottom: 0, left: SIDEBAR_WIDTH + SPACING_SMALL }}>
        <Panel title='Execution Plan!!!!!!!!!!!!!!!!'>
          <ExecutionPlan />
        </Panel>
      </div>
    </div>
  </div>
)

const selectProject = (state) => state.project
const selectProjectLoadError = (state) => state.projectLoadError
const selectSelectedScenario = (state) => state.selectedScenario

const ScenarioList = connect(
  (state) => ({
    project: selectProject(state),
    projectLoadError: selectProjectLoadError(state),
    selectedScenario: selectSelectedScenario(state)
  }),
  (dispatch) => ({
    onSelectScenario: (scenarioReference) => {
      history.push(ScenarioReference.getLocationTransition(scenarioReference))
    }
  })
)(
  ({ project, projectLoadError, selectedScenario, onSelectScenario }) => {
    if (projectLoadError) {
      return <LoadError error='Oops' />
    }
    if (project) {
      const matcher = selectedScenario ? ScenarioReference.matcher(selectedScenario) : () => false
      return (
        <div>
          {project.features.map((feature) => (
            <Feature key={feature.filename} name={feature.name} file={feature.filename}>
              {feature.scenarios.map((scenario) => {
                const ref = ScenarioReference.init({
                  featureFilename: feature.filename,
                  scenarioName: scenario.name
                })
                return (
                  <Scenario
                    name={scenario.name}
                    key={scenario.name}
                    onClick={() => onSelectScenario(ref)}
                    selected={matcher(ref)}
                  />
                )
              })}
            </Feature>
          ))}
        </div>
      )
    }
    return <LoadingProject />
  }
)

const LoadingProject = () => (
  <div style={{ padding: '1rem' }}>Loading project…</div>
)

const LoadError = ({ error }) => (
  <div style={{ padding: '1rem' }}><ErrorBox status='error' error={error} /></div>
)

export const ScenarioListDemo = () => (
  <div>
    <Feature name='One'>
      <Scenario name='My Scenario' />
      <Scenario name='Another scenario' />
    </Feature>
  </div>
)

const ListItem = ({ children, style = { }, ...props }) => (
  <div style={{ padding: '0.25rem 0.5rem', ...style }} {...props}>{children}</div>
)

const Feature = ({ name, children }) => (
  <div>
    <ListItem>
      <h2 style={{ ...resetBox, fontSize: '1em' }}>{name}</h2>
    </ListItem>
    {children}
  </div>
)

const Scenario = ({ name, onClick, selected }) => (
  <ListItem onClick={onClick} style={{ cursor: 'pointer' }}>
    <div
      style={{
        paddingLeft: '1rem',
        color: selected ? '#ff9' : '',
        fontWeight: selected ? 'bold' : ''
      }}
    >{name}</div>
  </ListItem>
)

const ExecutionPlan = () => (
  <ExecutionPlanDemo />
)

export const ExecutionPlanDemo = () => (
  <div>
    <ExecutionSection title='Background'>
      <Step keyword='Given' name='I opened a browser' status='completed' />
    </ExecutionSection>
    <ExecutionSection title='Feature: Searching for Taskworld on Google'>
      <Step keyword='Given' name='I am on Google' status='running' />
      <Step keyword='When' name='I search for Taskworld' />
      <Step keyword='Then' name='the first result should link to Taskworld home page' status='invalid' error='Missing context: defaultBrowser' />
    </ExecutionSection>
    <ExecutionSection title='Showcase'>
      <Step keyword='Step' name='a pending step' />
      <Step keyword='Step' name='a running step' status='running' />
      <Step keyword='Step' name='an errored step' status='error' error='ReferenceError: something is not defined' />
      <Step keyword='Step' name='a multiline errored step' status='error' error={'ReferenceError: something is not defined\n    at foo\n    at bar\n    at baz'} />
      <Step keyword='Step' name='a step containing other steps'>
        <Step keyword='Step' name='an invalid step' status='invalid' error='Cannot find any matching step definition' />
        <Step keyword='Step' name='an invalid step' status='invalid' error='Multiple step definitions found matching this step' />
        <Step keyword='Step' name='an invalid step' status='invalid' error='Cannot initiate step' />
      </Step>
    </ExecutionSection>
  </div>
)

const ExecutionSection = ({ title, children }) => (
  <div>
    <ListItem>
      <h2 style={{ ...resetBox, fontSize: '1em', color: '#60796C' }}>{title}</h2>
    </ListItem>
    {children}
  </div>
)

const statusColor = (status) => {
  switch (status) {
    case 'running': return '#5FC1F7'
    case 'invalid': return '#616D67'
    case 'completed': return '#7CFF68'
    case 'error': return '#FF7B7B'
    default: return ''
  }
}

const Step = ({ keyword, name, children, status, error }) => (
  <div>
    <ListItem>
      <strong style={{ display: 'inline-block', width: '4rem', textAlign: 'right', color: '#9ec5ab' }}>{keyword}</strong>
      {' '}
      <span style={{ color: statusColor(status) }}>{name}</span>
    </ListItem>
    {error ? <div style={{ margin: '0 0.5rem 0 4.8rem' }}><ErrorBox status={status} error={error} /></div> : null}
    <div style={{ marginLeft: '2rem' }}>
      {children}
    </div>
  </div>
)

const ErrorBox = ({ status, error }) => (
  <div style={{ borderColor: statusColor(status), borderStyle: 'solid', borderWidth: 1, padding: '0.5rem', borderRadius: '0.25rem' }}>
    <pre style={{ ...resetBox, whiteSpace: 'pre-wrap', font: '0.75rem Menlo' }}>{String(error)}</pre>
  </div>
)

const Panel = ({ title, children }) => (
  <section style={{ ...fill, border: '1px solid #9ec5ab' }}>
    <h1 style={{ ...fill, ...resetBox, padding: '0 0.5rem', fontSize: '1.2rem', lineHeight: '2rem', background: '#32746d', right: 0, height: '2rem', left: 0 }}>{title}</h1>
    <div style={{ ...fill, top: '2rem', overflow: 'auto' }}>
      {children}
    </div>
  </section>
)
