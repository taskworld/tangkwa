Feature: Google Ranking
  This is a comment

  Background:
    Given I opened a browser

  Scenario: Searching for Taskworld on Google
    Given I am on Google
    When I search for Taskworld
    Then the first result should link to Taskworld home page
