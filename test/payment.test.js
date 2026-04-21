// payment.test.js
// Master test file that runs ALL tests together

//  USER STORY 1: Successful Transaction
require('./UserStory1.test');

//  USER STORY 2: Duplicate Request 
require('./UserStory2.test');

//  USER STORY 3: Conflict Check 
require('./UserStory3.test');

//  BONUS: Race Condition
require('./BonusRaceCondition.test');

//  DEVELOPER'S CHOICE: Auth + Transactions
require('./DevelopersChoice.test');