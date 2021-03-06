# Test the getActivity function
# Function should be able to send a query string to the fitbit api and get some data in the right format back
library(here)
library(fitbitr)
library(testthat)

conf <- readRDS(here("tests/testthat/fitbitToken.rds"))

context("Basic Querying")


test_that("We get something back for different queries", {
  # Check token on first test.
  queryResultsHr = tryCatch({
    queryApi(
      query_string = 'https://api.fitbit.com/1/user/-/activities/heart/date/2017-07-31/1d/1min/time/00:00/23:59.json',
      token_or_conf = conf
    )
  }, error = function(e) {
    skip("Token seems to be stale")
  })

  queryResultsSteps <- queryApi(
    query_string = 'https://api.fitbit.com/1/user/-/activities/steps/date/2017-07-31/1d/1min/time/00:00/23:59.json',
    token_or_conf = conf
  )

  queryResultUser <- queryApi(
    query_string = 'https://api.fitbit.com/1/user/-/profile.json',
    token_or_conf = conf
  )

  expect_false(is.null(queryResultsHr))
  expect_false(is.null(queryResultsSteps))
})


# Code to refresh token
# token <- makeConfig(api_keys)
# saveRDS(token, here("tests/testthat/fitbitToken.rds"))
