#' Grabs both heartrate and steps for a each day in a provided vector at 1 minute intervals.
#' @param config An oauth config object setup with your token.
#' @param desired_days A character vector of dates in yyyy-MM-dd format.
#' @return A dataframe with two rows. time of the day in seconds and steps for the previous minute.
#' @export
#' @examples
#' myDays <- getPeriodProfile(myToken, desired_days = c("2017-07-31", "2017-07-30", "2017-07-29"))
getPeriodProfile <- function(
  token,
  desired_days
){
  # Initialize the first day
  days_data <- getDayProfile(token, date = desired_days[1])
  # loop through the rest of the days
  for(day in desired_days[-1]){
    days_data <- days_data %>%
      dplyr::bind_rows(
        getDayProfile(token, date = day)
      )
  }
  days_data
}
