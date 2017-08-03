#' Grabs heart-rate data from the fitbit api.
#' @param token An oauth config object setup with your token.
#' @param resolution Can be set to "seconds" for 1 second intervals or "minutes" for 1 minute intervals. Defaults to seconds.
#' @param date The day for which you want data. Defaults to the current day. Day format is yyyy-MM-dd.
#' @param startTime HH:MM 24 hour time for when you want to start getting data. Defaults to midnight.
#' @param endTime HH:MM 24 hour time for when you want to stop getting data. Defaults to 23:59.
#' @return A dataframe with two rows. time of the day in seconds and beats per minute for that timepoint.
#' @export
#' @examples
#' my_hr <- getHr(
#'   config = conf,
#'   resolution = 'seconds',
#'   date = 'today',
#'   startTime = "00:00",
#'   endTime = "23:59"
#'  )
getHr <- function(
  token,
  resolution = 'seconds',
  date = 'today',
  startTime = "00:00",
  endTime = "23:59"
){
  res <- ifelse(resolution == "seconds", "1sec", "1min")

  #grab activity result from the api.
  query_result <- getActivity(
    token,
    type = 'heart',
    date = date,
    startTime = startTime,
    endTime = endTime,
    resolution = res
  )

  timeSeries <- query_result$`activities-heart-intraday`$dataset

  # If the query result is empty
  if(length(timeSeries) == 0){
    #Make an empty dataframe to return
    parsedResult <- dplyr::data_frame(time = numeric(), heart_rate = numeric())
  } else {
    parsedResult <- timeSeries %>%
      dplyr::mutate(time = as.numeric(lubridate::hms(time))) %>%
      dplyr::rename(heart_rate = value)
  }

  return(parsedResult)
}
