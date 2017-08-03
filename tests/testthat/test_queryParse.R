# Testing the query response parser.
# Function should be able to send a query string to the fitbit api and get some data in the right format back
library(here)
library(fitbitr)
queryResponse <- readRDS(here("tests/testthat/hrRawQuery.rds"))

context("Parsing query response")

parsedQuery <- queryParse(queryResponse)

test_that("We get something back at all", {
  expect_false(is.null(parsedQuery))
})

test_that("Returns the correct names names of the lists",{
  expect_equal(names(parsedQuery), c("activities-heart","activities-heart-intraday"))
})

# Todo capture error from ratelimit to test.
