# script interface with api
#convert a string to base64
library(fitbitr)
library(tidyverse)


# This will be expired by the time this is used so you'll need a new one
token <- "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzSzYzRFgiLCJhdWQiOiIyMjg3UU0iLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJybG9jIHJ3ZWkgcmhyIHJhY3QgcnNsZSIsImV4cCI6MTUyMzU4NzE4NywiaWF0IjoxNTIzNTU4Mzg3fQ.KNE3pNYJVbTvvRydh9Vtnl4vOAnJeAkGvDB5rweVruM"



activities <- getActivitiesList("2018-01-01", token)

gatherHr <- function(heartRateLink, activityName, startTime, token){
  heartRateLink %>%
    queryApi(token) %>% 
    parseQuery() %>% {
      .$`activities-heart-intraday`$dataset
    } %>% 
    mutate(
      type = activityName,
      time = time,
      start = startTime
    )
}

allHrs <- activities %>% 
  filter(!is.na(heartRateLink)) %>% {
  purrr::pmap_df(
    list(.$heartRateLink, .$activityName, .$startTime),
    gatherHr, 
    token = token
  )
}

allHrs %>% 
  group_by(type, start) %>% 
  filter(type == 'Treadmill') %>% 
  mutate(startTime = dplyr::first(time)) %>%
  ungroup() %>% 
  mutate(
    timeSinceStart = (lubridate::hms(time) - lubridate::hms(startTime)) %>% as.numeric()
  ) %>% 
  ggplot(aes(x = timeSinceStart, y = value, id = startTime)) + 
  geom_line(alpha = 0.3) +
  geom_smooth(se = F, size = 0.5) +
  facet_wrap(~start) +
  theme_minimal()

leftFitbitOn <- activities$startTime[activities$duration == 49367000]
allHrs %>% 
  group_by(type, start) %>% 
  filter(type == 'Weights' & start != leftFitbitOn) %>% 
  mutate(startTime = dplyr::first(time)) %>%
  ungroup() %>% 
  mutate(
    timeSinceStart = (lubridate::hms(time) - lubridate::hms(startTime)) %>% as.numeric()
  ) %>% 
  ggplot(aes(x = timeSinceStart, y = value, id = startTime)) + 
  geom_line(alpha = 0.3) +
  geom_smooth(se = F, size = 0.5) +
  facet_wrap(~start) +
  theme_minimal()

