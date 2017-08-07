# Testing the query response parser.
# Function should be able to send a query string to the fitbit api and get some data in the right format back
library(here)
library(fitbitr)

hrQueryResponse    <- readRDS(here("tests/testthat/queryReturns/hrQuery.rds"))
stepsQueryResponse <- readRDS(here("tests/testthat/queryReturns/stepsQuery.rds"))
userQueryResponse  <- readRDS(here("tests/testthat/queryReturns/userQuery.rds"))
badQuery           <- readRDS(here("tests/testthat/queryReturns/bad400Query.rds"))

context("Parsing query response")

hrParsed    <- parseQuery(hrQueryResponse)
stepsParsed <- parseQuery(stepsQueryResponse)
userParsed  <- parseQuery(userQueryResponse)


test_that("We get something back at all", {
  expect_false(is.null(hrParsed))
})

test_that("Returns the correct names names of the lists",{
  expect_equal(names(hrParsed), c("activities-heart","activities-heart-intraday"))
})

test_that("correct hr parsing",
  expect_equal(
    hrParsed,
    readRDS(here("tests/testthat/queryReturns/hrQuery_parsed.rds"))
  )
)

test_that("correct steps parsing",
  expect_equal(
    stepsParsed,
    readRDS(here("tests/testthat/queryReturns/stepsQuery_parsed.rds"))
  )
)

test_that("catches malformed queries",
  expect_error(
    parseQuery(badQuery),
    "Your query is malformed. Try using makeQueryString() to ensure correct forms or see the fitbit api docs for reference (https://dev.fitbit.com/)", fixed = TRUE
  )
)

# Capture stale token response.
# Todo capture error from ratelimit to test.
