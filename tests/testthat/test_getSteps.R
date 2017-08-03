# Testing the get steps function
library(here)
library(fitbitr)
token <- readRDS(here("tests/testthat/fitbitToken.rds"))
properResult <- readRDS(here("tests/testthat/stepsGoodQuery.rds") )

context("Returns proper result for good query")

stepsQuery <- getSteps(
  token = token,
  date = '2017-08-02',
  startTime = "00:00",
  endTime = "23:59"
)

emptyQuery <- getSteps(
  token = token,
  date = '2020-08-02',
  startTime = "00:00",
  endTime = "23:59"
)

test_that("We get correct result", {
  expect_equal(stepsQuery, properResult)
})

test_that("We get an empty dataframe when we dont have any data for the day", {
  expect_equal(dim(emptyQuery)[1], 0)
})

