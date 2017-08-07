# Test the extractIntraday function
library(here)
library(fitbitr)
library(testthat)

hrQuery    <- readRDS(here("tests/testthat/queryReturns/hrQuery_parsed.rds"))
userQueryResponse  <- readRDS(here("tests/testthat/queryReturns/userQuery_parsed.rds"))

context("Retrieving intraday data from a parsed query")

hrData <- extractIntraday(hrQuery)

test_that("We get something back at for HR", {
  expect_equal(dim(hrData),c(1397, 3))
  expect_equal(names(hrData), c('time', 'value', 'type'))
  expect_true(hrData$type[1] == 'heart rate')
})

test_that("We get an error when mistakenly trying to get data from a non-intraday query", {
  expect_error(
    extractIntraday(userQueryResponse),
    "It doesn't look like the parsed query provided is an intraday one.", fixed = TRUE
  )
})
