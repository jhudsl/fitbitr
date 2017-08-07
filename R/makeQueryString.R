#' Takes a type of query, a day of the query and optionally a time range and returns the proper query string.
#' @param type What data we want. Currently supported at the default activity tags and also heart rate ('heart') and user info ('user'). See fitbit activity options for potential types https://dev.fitbit.com/docs/activity/#activity-time-series
#' @param date The day for which you want data. Defaults to the current day. Day format is yyyy-MM-dd.
#' @param startTime HH:MM 24 hour time for when you want to start getting data. Defaults to midnight.
#' @param endTime HH:MM 24 hour time for when you want to stop getting data. Defaults to 23:59.
#' @return A dataframe with two rows. time of the day in seconds and steps for the previous minute.
#' @export
#' @examples
#' hrQueryString <- makeQueryString(
#'   type = 'heart',
#'   date = 'today',
#'   startTime = "00:00",
#'   endTime = "23:59"
#'  )
makeQueryString <- function(
  type,
  date = 'today',
  startTime = "00:00",
  endTime = "23:59",
  activityDetail = "1min"
){

  # This is the list of possible basic activity queries from the fitbit api as of August 7th 2017 (https://dev.fitbit.com/docs/activity/#activity-time-series)
  # Note that heart(rate) is not in here. This is because it has a slightly different syntax (basically just different resolution options. )
  activityTypes = c( 'calories',
                     'caloriesBMR',
                     'steps',
                     'distance',
                     'floors',
                     'elevation',
                     'minutesSedentary',
                     'minutesLightlyActive',
                     'minutesFairlyActive',
                     'minutesVeryActive',
                     'activityCalories'
                    )

  # Some logical checks for info about the query.
  isBasicActivity <- type %in% activityTypes
  isHeartRate <- type == 'heart'
  isProfile <- type == 'user'


  # Some basic logic tests to make sure the date is in correct form.
  # Obviously simplistic as in not every month is 31 days but oh well.
  isValidDate <- function(date){
    if(date == "today"){
      return(TRUE)
    }

    correctForm <- grepl("[0-9]{4}-[0-9]{2}-[0-9]{2}", date)
    if(!correctForm){
      return(FALSE)
    }

    year <- as.numeric(gsub("-[0-9]{2}-[0-9]{2}", "", date))
    month <- as.numeric(gsub("[0-9]{4}-|-[0-9]{2}", "", date))
    day <- as.numeric(gsub("[0-9]{4}-[0-9]{2}-", "", date))

    dayInRange <- day <= 31 & day >= 1
    monthInRange <- month <= 12 & month >= 1
    yearInRange <- year >= 2006 #fitbit was founded in 2007.

    return(dayInRange & monthInRange & yearInRange)
  }


  # if the user gave us a specific date rather than "today" lets check to make sure it's in the correct form.
  if(!isValidDate(date)){
    stop("Sorry that date form is not recognized. Please use the form yyyy-MM-dd")
  }

  # Check for problem with temporal resolution requests.
  if(isBasicActivity & !(activityDetail %in% c("1min", "15min"))){
    stop("Sorry that type of activity is not available at that resolution. Please try with either '1min' or '15min'.")
  }

  if( isHeartRate & !(activityDetail %in% c("1sec", "1min"))){
    stop("Sorry that resolution is not supported for heart rate. Please try again with either '1sec' or '1min'.")
  }

  if(isBasicActivity | isHeartRate){
    queryString <- sprintf("https://api.fitbit.com/1/user/-/activities/%s/date/%s/1d/%s/time/%s/%s.json",
                           type, date, activityDetail, startTime, endTime)
  } else if(isProfile) {
    queryString <- "https://api.fitbit.com/1/user/-/profile.json"
  } else {
    stop("Sorry that query type is not currently supported. If you really desire it please submit a PR or issue to the github (https://github.com/jhudsl/fitbitr)")
  }


  return(queryString)
}
