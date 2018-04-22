# script interface with api
library(fitbitr)
library(tidyverse)


# This will be expired by the time this is used so you'll need a new one
token <- "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzSzYzRFgiLCJhdWQiOiIyMjg3UU0iLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJybG9jIHJ3ZWkgcmFjdCByaHIgcnNsZSIsImV4cCI6MTUyNDQ0OTgzNywiaWF0IjoxNTI0NDIxMDM3fQ.q6gsHieSeJ4OwMlckfhN3RGBIEGU7ZfpHqk6kRfJSiw"


activities <- getActivitiesList(token = token)

my_activities <- activities$activities_list
for(i in 1:5){
  # get new batch
  activities <- getActivitiesList(
    premade_link = activities$next_link, 
    token = token
  )
  
  # append to dataframe
  my_activities <- bind_rows(my_activities, activities$activities_list)
}


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

# follow heartrate links and download heartrate data
allHrs <- my_activities %>% 
  filter(activityName %in% c('Run', 'Treadmill')) %>% 
  filter(!is.na(heartRateLink)) %>% {
  purrr::pmap_df(
    list(.$heartRateLink, .$activityName, .$startTime),
    gatherHr, 
    token = token
  )
}

# plot!
allHrs %>% 
  group_by(type, start) %>% 
  filter(type == 'Treadmill') %>% 
  mutate(startTime = dplyr::first(time)) %>%
  ungroup() %>% 
  mutate(
    timeSinceStart = (lubridate::hms(time) - lubridate::hms(startTime)) %>% as.numeric()
  ) %>% 
  ggplot(aes(x = timeSinceStart, y = value, id = startTime)) + 
  geom_line(color ='#f03b20', size = 0.4, alpha = 0.6) +
  geom_smooth(se = F, size = 0.7, color =  '#feb24c') +
  facet_wrap(~start) +
  scale_y_continuous(expand = c(0, 0)) +
  scale_x_continuous(expand = c(0.02, 0)) +
  theme_void() +
  theme(
    strip.background = element_blank(),
    strip.background = element_blank(),
    strip.background = element_blank(),
    strip.background = element_blank(),
    strip.background = element_blank(),
    strip.text = element_blank(),
    panel.spacing = unit(0, 'lines')
  )

