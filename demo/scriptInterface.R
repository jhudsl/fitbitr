# script interface with api

library(fitbitr)
library(tidyverse)
# This will be expired by the time this is used so you'll need a new one
token <- "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzSzYzRFgiLCJhdWQiOiIyMjg3UU0iLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyYWN0IHJociBycHJvIHJzbGUiLCJleHAiOjE1MDI5MjE5NTMsImlhdCI6MTUwMjg5MzE1M30.a8sM9ug6BiWlVf__UO3NUDTf_3sGsxxidZQJDTLZsQU"

todaysHr <- getTimeSeries(
  token,
  type = 'heart',
  activityDetail = '1min',
  date = 'today',
  startTime = "00:00",
  endTime = "23:59"
)
