# tangkwa

A JavaScript-and-Gherkin-based interactive test development framework.


## What is it?

Writing solid end-to-end test is a very hard task.
When we run end-to-end tests, “it’s such a slow life!”


## What would the solution look like?

- A JavaScript framework to create a test harness for feature files.
- Tests created using this framework can be run in `cucumber-js` (for CI).
- Tests created using this framework can be run in a web-based IDE with these abilities:
  - Ability to run each Cucumber step interactively.
  - Allow hot-reloading of step definition during development.
  - Allow introspection of test state.
- Leverages modern JavaScript techniques:
  - Steps are defined based on ES-async functions.
