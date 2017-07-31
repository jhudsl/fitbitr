#' Grabs time series data at 1 minute intervals on elevation. It's important to note that this is a relative measure and not feet above sea-level.
#' @param config An oauth config object setup with your token.
#' @param date The day for which you want data. Defaults to the current day. Day format is yyyy-MM-dd.
#' @param startTime HH:MM 24 hour time for when you want to start getting data. Defaults to midnight.
#' @param endTime HH:MM 24 hour time for when you want to stop getting data. Defaults to 23:59.
#' @return A dataframe with two rows. time of the day in seconds and elevation at timepoint.
#' @export
#' @examples
#' my_elevation <- get_elevation(
#'   config = conf,
#'   date = 'today',
#'   startTime = "00:00",
#'   endTime = "23:59"
#'  )
getElevation <- function(
  config,
  date = 'today',
  startTime = "00:00",
  endTime = "23:59"
){
  #grab activity result from the api.
  query_result <- getActivity(
    config,
    type = 'elevation',
    date = date,
    startTime = startTime,
    endTime = endTime
  )

  query_result$`activities-elevation-intraday`$dataset %>%
    dplyr::as_data_frame() %>%
    dplyr:mutate(time = as.numeric(lubridate::hms(time))) %>%
    dplyr:rename(elevation = value)
}
