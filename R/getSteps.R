#' Grabs time series data at 1 minute intervals on steps.
#' @param config An oauth config object setup with your token.
#' @param date The day for which you want data. Defaults to the current day. Day format is yyyy-MM-dd.
#' @param startTime HH:MM 24 hour time for when you want to start getting data. Defaults to midnight.
#' @param endTime HH:MM 24 hour time for when you want to stop getting data. Defaults to 23:59.
#' @return A dataframe with two rows. time of the day in seconds and steps for the previous minute.
#' @export
#' @examples
#' my_steps <- getSteps(
#'   config = conf,
#'   date = 'today',
#'   startTime = "00:00",
#'   endTime = "23:59"
#'  )
getSteps <- function(
  token,
  date = 'today',
  startTime = "00:00",
  endTime = "23:59"
){
  #grab activity result from the api.
  query_result <- getActivity(
    token,
    type = 'steps',
    date = date,
    startTime = startTime,
    endTime = endTime
  )

  timeSeries <- query_result$`activities-steps-intraday`$dataset

  # If the query result is empty
  if(length(timeSeries) == 0){
    #Make an empty dataframe to return
    parsedResult <- dplyr::data_frame(time = numeric(), steps = numeric())
  } else {
    parsedResult <- timeSeries %>%
      dplyr::mutate(time = as.numeric(lubridate::hms(time))) %>%
      dplyr::rename(steps = value)
  }

  # If you query the future in the api for steps, it just says 0, replace this with empty df.
  if(max(parsedResult$steps) == 0) {
    parsedResult <- dplyr::data_frame(time = numeric(), steps = numeric())
  }

  return(parsedResult)
}
