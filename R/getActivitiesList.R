makeActivityQuery <- function(afterDate, sortDir = 'asc', limit = 100){
  sprintf("https://api.fitbit.com/1/user/-/activities/list.json?afterDate=%s&sort=%s&offset=0&limit=%i",
          afterDate, sortDir,limit)
}

#' Grabs both heartrate and steps for a given date at 1 minute intervals.
#' @param afterDate Character string of date in yyyy-MM-dd format e.g. ("2017-07-31").
#' @param token Valid OAuth token for the fitbit api. Make sure you have requested the activities scope!
#' @return A dataframe with columns "activeDuration": how many seconds the activity took,"activityName": fitbit name for whatever activity you did, "averageHeartRate": average heart rate during activity, "duration": how many seconds the activity lasted, "heartRateLink": link that can be used to query api for heart rate time series for this activity, "startTime": start date and time of activity; and however many rows the query returned.
#' @return A dataframe with columns "activeDuration": how many seconds the activity took,"activityName": fitbit name for whatever activity you did, "averageHeartRate": average heart rate during activity, "duration": how many seconds the activity lasted, "heartRateLink": link that can be used to query api for heart rate time series for this activity, "startTime": start date and time of activity; and however many rows the query returned.
#' @export
#' @examples
#' desired_date <- "2018-04-01"
#' activities <- getActivitiesList(desired_date, token)
getActivitiesList <- function(afterDate, token){
  results <- makeActivityQuery(afterDate) %>%
    queryApi(token) %>% 
    parseQuery() %>% 
    .$activities
  
  weights_and_running_cols <- results$activityName %in% c("Weights", "Treadmill")
  columns_of_interest <- c("activeDuration","activityName", "averageHeartRate", "duration", "heartRateLink", "startTime")
  
  results[weights_and_running_cols, columns_of_interest] %>% 
    as_data_frame()
}
