import * as ScenarioReference from '../tangkwa-core/ScenarioReference'

import JSONTree from 'react-json-tree'
import React from 'react'
import { connect } from 'react-redux'
import { compose, withProps } from 'recompose'

import history from './history'
import { selectProject, selectProjectLoadError, selectSelectedScenario, selectExecutionPlan } from './redux'

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
        <div style={{ ...fill, right: '50%' }}>
          <div style={{ ...fill, right: SPACING_SMALL / 2 }}>
            <Panel title='Execution Plan!!!!!!!!!!!!!!!!'>
              <ExecutionPlan />
            </Panel>
          </div>
        </div>
        <div style={{ ...fill, left: '50%' }}>
          <div style={{ ...fill, left: SPACING_SMALL / 2 }}>
            <Panel title='Test Step Inspector!!!!!!!!!!!'>
              <StateInspector />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const StateInspector = compose(
  withProps({
    theme: {
      scheme: 'monokai',
      author: 'wimer hazenberg (http://www.monokai.nl)',
      base00: '#272822',
      base01: '#383830',
      base02: '#49483e',
      base03: '#75715e',
      base04: '#a59f85',
      base05: '#f8f8f2',
      base06: '#f5f4f1',
      base07: '#f9f8f5',
      base08: '#f92672',
      base09: '#fd971f',
      base0A: '#f4bf75',
      base0B: '#a6e22e',
      base0C: '#a1efe4',
      base0D: '#66d9ef',
      base0E: '#ae81ff',
      base0F: '#cc6633'
    },
    isLightTheme: false,
    invertTheme: false,
    hideRoot: true
  }),
  connect(
    (state) => ({
      data: state
    })
  )
)(JSONTree)

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
      return <LoadError error={projectLoadError} />
    }
    if (project) {
      const matcher = selectedScenario ? ScenarioReference.matcher(selectedScenario) : () => false
      return (
        <div>
          {project.features.map((feature) => (
            <Feature key={feature.filename} name={feature.name} file={feature.filename}>
              {feature.scenarios.map((scenario) => {
                const ref = ScenarioReference.initWithFeatureAndScenario(feature, scenario)
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

const ListItem = ({ children, onClick, style = { }, highlighted, ...props }) => (
  <div
    onClick={onClick}
    style={{
      padding: '0.25rem 0.5rem',
      background: highlighted ? 'rgba(47,116,109,0.2)' : '',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }}
    {...props}
  >
    {children}
  </div>
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
  <ListItem onClick={onClick} highlighted={selected}>
    <div
      style={{
        paddingLeft: '1rem',
        color: selected ? '#ff9' : '',
        fontWeight: selected ? 'bold' : ''
      }}
    >{name}</div>
  </ListItem>
)

const ExecutionPlan = connect(
  (state) => ({
    executionPlan: selectExecutionPlan(state)
  }),
  (dispatch) => ({
    onSelectStep: (step) => {
      alert('Selected step: ' + require('util').inspect(step))
    }
  })
)(({ executionPlan, onSelectStep }) => (executionPlan
  ? (
    <div>
      {executionPlan.sections.map((section) => (
        <ExecutionSection title={section.title} key={section.title}>
          {section.steps.map((step) => {
            const renderStep = (props) => (
              <Step
                keyword={step.info.keyword}
                name={step.info.text}
                key={step.id}
                onClick={() => onSelectStep(step)}
                {...props}
              />
            )
            if (step.valid) {
              return renderStep({ })
            } else {
              return renderStep({ status: 'invalid', error: step.reason })
            }
          })}
        </ExecutionSection>
      ))}
    </div>
  )
  : (
    <div style={{ padding: '1rem' }}>
      Please select a scenario to run on the left.
    </div>
  )
))

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

const Step = ({ keyword, name, children, status, error, onClick }) => (
  <div>
    <ListItem onClick={onClick}>
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
