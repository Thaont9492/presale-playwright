Feature: Preorder Product
  As a customer
  I want to be able to preorder products
  So that I can get them before they are released

  Background:
    Given I am on the preorder product page

  @preorder-checkout
  Scenario: Checkout successfully completes
    When I click on the pre-order button
    And The cart notification is visible
    And I click on the checkout button
    And I fill in the checkout form
    And I click on Complete button
    Then The order is successfully placed

  @notify-me
  Scenario: Click notify me button
    Given I am clicking on the notify me button
    When I fill in the email address
    And I click on the notify me button on popup
    Then I should see a notification
