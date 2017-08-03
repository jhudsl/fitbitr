# Testing the get heartrate function
library(here)
library(fitbitr)
token <- readRDS(here("tests/testthat/fitbitToken.rds"))
properResult <- readRDS(here("tests/testthat/hrGoodQuery.rds") )

context("Returns proper result for good query")

hrQuery <- getHr(
  token = token,
  resolution = 'seconds',
  date = '2017-08-02',
  startTime = "00:00",
  endTime = "23:59"
 )

emptyQuery <- getHr(
  token = token,
  resolution = 'seconds',
  date = '2020-08-02',
  startTime = "00:00",
  endTime = "23:59"
)

test_that("We get correct result", {
  expect_equal(hrQuery, properResult)
})

test_that("We get an empty dataframe when we dont have any data for the day", {
  expect_equal(dim(emptyQuery)[1], 0)
})

