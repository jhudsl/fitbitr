#' Takes a parsed intraday query and returns the timeseries data from within.
#' @param parsedQuery The query string to be sent in. See given API docs for details.
#' @return dataframe with column of time, value, and type.
#' @export
#' @examples
#' extractIntraday = (myHrQuery)
#' @import dplyr
extractIntraday <- function(parsedQuery){
  # Get the names of the fields in the return query list
  queryNames <-  names(parsedQuery)

  # Find the name of the field corresponding to the intraday data
  intradayField <- queryNames[which(grepl("intraday", queryNames))]

  if( length(intradayField) == 0) {
    stop("It doesn't look like the parsed query provided is an intraday one.")
  }

  # Extract the type from the column name.
  type <- gsub("activities-|-intraday", "", intradayField)

  # I find just 'heart' to be weird so we change just this one to heartrate. Otherwise leave the name the same.
  if(type == 'heart') {
    type <- 'heart rate'
  }

  timeSeriesData <- parsedQuery[[intradayField]]$dataset

  if(length(timeSeriesData) == 0){
    # If our query is empty, meaning data hasn't been synced, then return an empty dataframe.
    return(dplyr::data_frame(type = character(), time = numeric(), value = numeric()))
  } else {
    # Otherwise, extract the data from the list and add a type column so we have that info.
    return(
      timeSeriesData %>%
        dplyr::mutate(
          type = type,
          time = as.numeric(lubridate::hms(time))
        )
    )
  }

}
