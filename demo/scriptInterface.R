# script interface with api
library(fitbitr)
library(tidyverse)

# This will be expired by the time this is used so you'll need a new one
token <- "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzSzYzRFgiLCJhdWQiOiIyMjg3UU0iLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJybG9jIHJ3ZWkgcmFjdCByaHIgcnNsZSIsImV4cCI6MTUyNDUyNTUyMCwiaWF0IjoxNTI0NDk2NzIwfQ.NV_Yok6wojG67XEhC8ZT8RxaeW7ULoVZa3vh7ofdP98"

activities <- getActivitiesList(token = token, count = 100)

heart_rates <- activities %>% 
  filter(
    activityName %in% c('Treadmill', 'Weights', 'Hike', 'Run'),
    !is.na(heartRateLink)
  ) %>% 
  getActivityHeartRates(token)

# plot!
heart_rates %>% 
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
    strip.text = element_blank(),
    panel.spacing = unit(0, 'lines')
  )

