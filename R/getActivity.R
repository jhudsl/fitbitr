#' A general interface to the activity intraday api. Not typically used directly but wrapped to create more specific functions like fitrbit::getHr.
#' @param config An oauth config object setup with your token.
#' @param type Which activity api you desire. Options are calories, steps, distance, floors, and elevation.
#' @param date The day for which you want data. Defaults to the current day. Day format is yyyy-MM-dd.
#' @param startTime HH:MM 24 hour time for when you want to start getting data. Defaults to midnight.
#' @param endTime HH:MM 24 hour time for when you want to stop getting data. Defaults to 23:59.
#' @param resolution Can choose between "1min" and "15min" although I'm not sure why you'd ever want 15 minute.
#' @return A dataframe with two rows. time of the day in seconds and beats per minute for that timepoint.
#' @export
#' @examples
#' # Get data on calories burned over time.
#' query_result <- getActivity(
#'   config,
#'   type = 'calories',
#'   date = date,
#'   startTime = startTime,
#'   endTime = endTime
#' )
#' @import httr jsonlite
getActivity <- function(
  token,
  type = 'steps',
  date = 'today',
  startTime = "00:00",
  endTime = "23:59",
  resolution = "1min"
){
  # Generate the relevant query string.
  queryString <- sprintf("https://api.fitbit.com/1/user/-/activities/%s/date/%s/1d/%s/time/%s/%s.json",
                          type, date, resolution, startTime, endTime)

  # Grab raw query
  queryResult <- fitbitGet(queryString, token)

  # Parse query into R object
  queryParse(queryResult)
}
