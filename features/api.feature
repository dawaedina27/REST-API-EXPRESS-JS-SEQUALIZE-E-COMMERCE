Feature: API behavior
  As an API consumer
  I want stable and testable API behavior
  So that I can rely on service contracts

  Scenario: Health endpoint responds successfully
    When I send a GET request to "/"
    Then the response status should be 200
    And the response JSON should be:
      """
      {
        "message": "E-commerce API is running"
      }
      """

  Scenario: Creating a user returns created payload
    Given user creation is mocked to succeed
    When I send a POST request to "/api/v1/users" with JSON:
      """
      {
        "name": "BDD User",
        "email": "bdd@example.com"
      }
      """
    Then the response status should be 201
    And the response JSON field "name" should be "BDD User"
    And the response JSON field "email" should be "bdd@example.com"
