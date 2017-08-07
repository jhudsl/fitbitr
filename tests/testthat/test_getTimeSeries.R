# Testing the get heartrate function
library(here)
library(fitbitr)

token <- readRDS(here("tests/testthat/fitbitToken.rds"))

context("Errors propigate through for queryString construction.")



test_that("We get an error for malformed heart rate queries", {
  expect_error(
    getTimeSeries(token, type = 'heart', activityDetail = '15min') ,
    "Sorry that resolution is not supported for heart rate. Please try again with either '1sec' or '1min'.", fixed=TRUE)
})

test_that("We get an error for a weird date form ", {
  expect_error(
    getTimeSeries(token, type = 'heart', date = "05/04/2017") ,
    "Sorry that date form is not recognized. Please use the form yyyy-MM-dd", fixed=TRUE)
})
