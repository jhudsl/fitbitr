# Testing the get activities function from package.
library(here)
library(tidyverse)
library(fitbitr)

# Load a correct function response
correctResponseHr <- readRDS(here("tests/testthat/hrParsedQuery.rds"))
correctResponseSteps <- readRDS(here("tests/testthat/stepsParsedQuery.rds"))

# Load token for api.
token <- readRDS(here("tests/testthat/fitbitToken.rds"))

context("getActivity works with heart rate and steps.")

hrQuery <- getActivity(
  token,
  type = 'heart',
  date = '2017-07-31',
  startTime = "00:00",
  endTime = "23:59",
  resolution = "1min"
)

stepsQuery <- getActivity(
  token,
  type = 'steps',
  date = '2017-07-31',
  startTime = "00:00",
  endTime = "23:59",
  resolution = "1min"
)

test_that("Matches a pulled query from July 31st 2017",{
  expect_equal(hrQuery, correctResponseHr)
  expect_equal(stepsQuery, correctResponseSteps)
})


