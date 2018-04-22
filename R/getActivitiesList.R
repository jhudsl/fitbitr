makeActivityQuery <- function(date, dateDirection, limit){
  
  if(dateDirection == 'before'){
    date_value <- 'beforeDate'
    sort_value <- 'desc'
  } else {
    date_value <- 'afterDate'
    sort_value <- 'asc'
  }
  

  sprintf("https://api.fitbit.com/1/user/-/activities/list.json?%s=%s&sort=%s&offset=0&limit=%i",
          date_value, date, sort_value, limit)
}

#' Grabs both heartrate and steps for a given date at 1 minute intervals.
#' @param date Character string of date in yyyy-MM-dd format e.g. ("2017-07-31"). If no date is given defaults to the current date. 
#' @param dateDirection Do you want to look for activities 'before' the supplied date, or 'after'? E.g. Give me 100 activities before april 1.
#' @param limit How many activities do you want to get? Max is 100.
#' @param premade_link Do you already have a query link? Otherwise one will be generated for you using the above paramters. This is for when you have retrieved a query already and are using the supplied \code{$next_link} value to get more results. 
#' @param token Valid OAuth token for the fitbit api. Make sure you have requested the activities scope!
#' @return A dataframe with columns "activeDuration": how many seconds the activity took,"activityName": fitbit name for whatever activity you did, "averageHeartRate": average heart rate during activity, "duration": how many seconds the activity lasted, "heartRateLink": link that can be used to query api for heart rate time series for this activity, "startTime": start date and time of activity; and however many rows the query returned.
#' @return A list with a dataframe \code{$activities_list} which contains columns "activeDuration": how many seconds the activity took,"activityName": fitbit name for whatever activity you did, "averageHeartRate": average heart rate during activity, "duration": how many seconds the activity lasted, "heartRateLink": link that can be used to query api for heart rate time series for this activity, "startTime": start date and time of activity; and however many rows the query returned. In addition, the list contains \code{$next_link} which is a link to get the next batch of activities from the api if you desire more than the 100 most recent. 
#' @export
#' @examples
#' # Get the 100 activities leading up to april 1st 2018:
#' activities <- getActivitiesList(date="2018-04-01", direction = 'before', token)
#' # grab another batch of 100 results using supplied next link. 
#' more_activities <- getActivitiesList(premade_link = activites$next_link)
getActivitiesList <- function(date = NULL, dateDirection = 'before', limit = 100, premade_link = NULL, token){
  
  # if no date is provided default to 'today'
  if(is.null(date)){
    date <- format(Sys.time(), "%Y-%m-%d")
  }
  
  if(is.null(premade_link)){
    query_link <- makeActivityQuery(date, dateDirection, limit)
  } else {
    query_link <- premade_link
  }
  
  results <- query_link %>%
    queryApi(token) %>% 
    parseQuery()
  
  columns_of_interest <- c("activeDuration","activityName", "averageHeartRate", "duration", "heartRateLink", "startTime")
  
  activities_list <- results$activities[, columns_of_interest] %>% 
    as_data_frame()
  
  next_link <- results$pagination$`next`
  
  list(activities_list = activities_list, next_link = next_link)
}
