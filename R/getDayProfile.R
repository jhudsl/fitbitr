#' Grabs both heartrate and steps for a given date at 1 minute intervals.
#' @param config An oauth config object setup with your token.
#' @param date The day for which you want data. Defaults to the current day. Day format is yyyy-MM-dd.
#' @return A dataframe with two rows. time of the day in seconds and steps for the previous minute.
#' @export
#' @examples
#' myProfile <- getDayProfile(myToken, date = "2017-07-31")
getDayProfile <- function(
  token,
  date = 'today'
){
  rbind(
    getTimeSeries(  # grab heartrate
      type = "heart",
      token,
      activityDetail = '1min', #we choose minutes because then it matches with steps.
      date = date
    ),
    getTimeSeries( # grab steps
      type = "steps",
      token,
      activityDetail = '1min',
      date = date
    )
  ) %>%
    dplyr::mutate(date = ifelse(as.character(date) == "today", as.character(Sys.Date()), date))
}
