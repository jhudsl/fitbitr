#' Takes two arrays: one of links to activity heart rate readings and another with ids for each activity and returns a long dataframe containing all the heart rate data for the supplied links. 
#' @param activities_list Dataframe returned by \code{getActiviiesList} which has the columns: \code{heartRateLink}, \code{activityName}, and \code{startTime}. 
#' @param token Valid OAuth token for the fitbit api. Make sure you have requested the activities scope!
#' @return A dataframe with columns "activeDuration": how many seconds the activity took,"activityName": fitbit name for whatever activity you did, "averageHeartRate": average heart rate during activity, "duration": how many seconds the activity lasted, "heartRateLink": link that can be used to query api for heart rate time series for this activity, "startTime": start date and time of activity; and however many rows the query returned.
#' @return A long dataframe containing all the heart rate data for the supplied links.
#' @export
#' @examples
#' # Get the 100 activities leading up to april 1st 2018:
#' activities <- getActivitiesList(date="2018-04-01", direction = 'before', token)
#' # grab another batch of 100 results using supplied next link. 
#' more_activities <- getActivitiesList(premade_link = activites$next_link)
getActivityHeartRates <- function(activities_list, token){
  
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
  
  link <- activities_list$heartRateLink
  name <- activities_list$activityName
  startTime <- activities_list$startTime
  
  purrr::pmap_df(
    list(link, name, startTime),
    gatherHr, 
    token = token
  )
}
