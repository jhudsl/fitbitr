# Test the getActivity function
# Function should be able to send a query string to the fitbit api and get some data in the right format back
library(here)
library(fitbitr)
conf <- readRDS(here("tests/testthat/fitbitToken.rds"))

context("Basic Querying")

queryResultsHr <- fitbitGet(
  query_string = 'https://api.fitbit.com/1/user/-/activities/heart/date/2017-07-31/1d/1min/time/00:00/23:59.json',
  token_or_conf = conf
 )
queryResultsSteps <- fitbitGet(
  query_string = 'https://api.fitbit.com/1/user/-/activities/steps/date/2017-07-31/1d/1min/time/00:00/23:59.json',
  token_or_conf = conf
)

test_that("We get something back at for HR", {
  expect_false(is.null(queryResultsHr))
})

test_that("We get something back at all for steps", {
  expect_false(is.null(queryResultsSteps))
})

