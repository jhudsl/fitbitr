# Tests for the query string stuff
# Testing the get steps function
library(here)
library(fitbitr)

context("Returns proper query string for different queries")


test_that("heart queries work", {
  expect_equal(
    makeQueryString(
      type = 'heart',
      date = '2017-08-02',
      startTime = "00:00",
      endTime = "23:59"
    ),
    "https://api.fitbit.com/1/user/-/activities/heart/date/2017-08-02/1d/1min/time/00:00/23:59.json")
})

test_that("step queries work", {
  expect_equal(
    makeQueryString(
      type = 'steps',
      date = '2016-04-06',
      startTime = "00:00",
      endTime = "23:59",
      activityDetail = "15min"
    ),
    "https://api.fitbit.com/1/user/-/activities/steps/date/2016-04-06/1d/15min/time/00:00/23:59.json")
})

test_that("queries of a random nonsupported activity throw an error.", {
  expect_error(
    makeQueryString(
      type = 'superjumps',
      date = '2016-04-06',
      startTime = "00:00",
      endTime = "23:59",
      activityDetail = "15min"
    ),
    "Sorry that query type is not currently supported. If you really desire it please submit a PR or issue to the github (https://github.com/jhudsl/fitbitr)", fixed=TRUE)
})

test_that("If we try and get a steps query with one second resolution we get an error about resolution", {
  expect_error(
    makeQueryString(
      type = 'steps',
      date = '2017-08-02',
      activityDetail = '1sec',
      startTime = '00:00',
      endTime = '23:59'
    ),
    "Sorry that type of activity is not available at that resolution. Please try with either '1min' or '15min'.", fixed=TRUE)
})

test_that("If we try and get a heartrate query with too course of a resolution we get an error", {
  expect_error(
    makeQueryString(
      type = 'heart',
      date = '2017-08-02',
      activityDetail = '15min',
      startTime = '00:00',
      endTime = '23:59'
    ),
    "Sorry that resolution is not supported for heart rate. Please try again with either '1sec' or '1min'.", fixed=TRUE)
})

test_that("User queries are detected", {
  expect_equal(
    makeQueryString(
      type = 'user'
    ),
    "https://api.fitbit.com/1/user/-/profile.json")
})
