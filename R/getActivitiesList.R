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
#' @param count How many activities do you want to get? Note that if value is greater than 100 multiple calls to the api will be completed and the amount of activities returned will be in increments of 100 due to how the fitbit api handles repeated requests. 
#' @param premade_link Do you already have a query link? Otherwise one will be generated for you using the above paramters. This is for when you have retrieved a query already and are using the supplied \code{$next_link} value to get more results. 
#' @param next_link Should the return be a list with a value \code{$next_link} supplied? Otherwise function just returns a dataframe with activities. 
#' @param token Valid OAuth token for the fitbit api. Make sure you have requested the activities scope!
#' @return A dataframe with columns "activeDuration": how many seconds the activity took,"activityName": fitbit name for whatever activity you did, "averageHeartRate": average heart rate during activity, "duration": how many seconds the activity lasted, "heartRateLink": link that can be used to query api for heart rate time series for this activity, "startTime": start date and time of activity; and however many rows the query returned.
#' @return If \code{next_link = TRUE}: A list with a dataframe \code{$activities_list} which contains columns "activeDuration": how many seconds the activity took,"activityName": fitbit name for whatever activity you did, "averageHeartRate": average heart rate during activity, "duration": how many seconds the activity lasted, "heartRateLink": link that can be used to query api for heart rate time series for this activity, "startTime": start date and time of activity; and however many rows the query returned. In addition, the list contains \code{$next_link} which is a link to get the next batch of activities from the api if you desire more than the 100 most recent. If \code{next_link = FALSE} (default) returns just the dataframe. 
#' @export
#' @examples
#' # Grab the 50 most recent activities from today. 
#' recents <- getActivitiesList(count = 50, token)
#' 
#' # Get the 200 activities leading up to april 1st 2018
#' activities <- getActivitiesList(date="2018-04-01", direction = 'before', count = 200, token)
#' 
#' # Get results and also return a link to download more. 
#' more_activities <- getActivitiesList(next_link = TRUE)
getActivitiesList <- function(date = NULL, dateDirection = 'before', count = 100, premade_link = NULL, next_link = FALSE, token){
  
  # if no date is provided default to tomorrow so we get activities from today.
  if(is.null(date)){
    date <- format((Sys.time() +as.difftime(1, unit="days")) , "%Y-%m-%d")
  }
  
  # figure out how many calls to the API we need to do to get as many results as desired. 
  num_calls <- ifelse(count <= 100, 1, round(count/100) + 1)
  
  # How many results do we want back from the API on each call? 
  limit <- ifelse(num_calls == 1, count, 100)
  
  # Initialize empty next link. 
  nextLink <- NULL
  
  # Were we given a preconstructed link for querying the API?
  no_provided_link <- is.null(premade_link)
  
  
  columns_of_interest <- c("activeDuration","activityName", "averageHeartRate", "duration", "heartRateLink", "startTime")
  
  # start loop of calls. Each time the API gets called and if we need more results the handily provided 'next' link will be used to grab more.
  for(i in 1:num_calls){
    
    # Is this our first call to the API?
    first_call <- i == 1

    # figure out what query link we need. 
    if(first_call){
      if(no_provided_link){
        query_link <- makeActivityQuery(date, dateDirection, limit)
      } else {
        query_link <- premade_link
      }
    } else {
      # we're in the second of third iteration now. 
      query_link <- nextLink
    }
    
    # Actually query api. 
    results <- query_link %>%
      queryApi(token) %>% 
      parseQuery()
    
    # peel off the activities list. 
    current_activities_list <- results$activities[, columns_of_interest] %>% 
      as_data_frame()
    
    # if this is our first call we need to initialize our activities_list dataframe... 
    if(first_call){
      activities_list <- current_activities_list
    } else {
      # ... otherwise we can just append our current rows to the existing. 
      activities_list <- bind_rows(
        activities_list, 
        current_activities_list
      )
    }
    nextLink <- results$pagination$`next`
  }
  
  # If the user wants the next link return a list, otherwise just give back the dataframe of activities. 
  if(next_link){
    list(activities = activities_list, next_link = next_link)
  } else {
    activities_list
  }
}
