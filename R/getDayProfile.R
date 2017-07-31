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
  # grab heartrate
  heart_rate <- getHr(
    token,
    resolution = 'minutes', #we choose minutes because then it matches with steps.
    date = date
  )
  # grab steps
  steps <- getSteps(
    token,
    date = date
  )

  # assemble them to one big dataframe
  heart_rate %>%
    dplyr::mutate(type = "heart rate") %>%
    dplyr::rename(value = heart_rate) %>%
    dplyr::bind_rows(
      steps %>%
        dplyr::mutate(type = "steps") %>%
        dplyr::rename(value = steps)
    ) %>%
    dplyr::mutate(date = ifelse(date == "today", as.character(Sys.Date()), date))
}
