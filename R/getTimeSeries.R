#' Queries fitbit api and returns a nice tidy dataframe of your time series for a given date and time range.
#' @param type string corresponding to the type of data you want. 'heart' returns heartrate, 'steps' steps etc. For full list of possible options see the fitbit api docs (https://dev.fitbit.com/docs/activity/#get-activity-intraday-time-series).
#' @param token An oauth config object setup with your token.
#' @param activityDetail Can be set to whatever resolution you desire for data as long as the fitbit api supports it. Currently that is '1sec' and '1min' for heart rate, or '1min' '15min' for other activities.
#' @param date The day for which you want data. Defaults to the current day. Day format is yyyy-MM-dd.
#' @param startTime HH:MM 24 hour time for when you want to start getting data. Defaults to midnight.
#' @param endTime HH:MM 24 hour time for when you want to stop getting data. Defaults to 23:59.
#' @return A dataframe with three rows. time of the day, value, and type = 'heart rate'.
#' @export
#' @examples
#' myHr <- getTimeSeries(
#'   token = conf,
#'   resolution = 'seconds',
#'   date = 'today',
#'   startTime = "00:00",
#'   endTime = "23:59"
#'  )
getTimeSeries <- function(
  token,
  type = 'heart',
  activityDetail = '1min',
  date = 'today',
  startTime = "00:00",
  endTime = "23:59"
){
  makeQueryString(type = type, date = date, startTime = startTime, endTime = endTime, activityDetail = activityDetail) %>%
    queryApi(token) %>%
    parseQuery() %>%
    extractIntraday()
}
