#' The httr GET likes for tokens to be in its own proprietary format which ours are not. This function allows the same functions to be used for the rest of the package if the authorization occured in shiny using our shinyauth package or just in the standard httr way.
#' @param query_string The query string to be sent in. See given API docs for details.
#' @param token_or_conf Can be either a string token (e.g. from shinyauth) or a config object (e.g. what you get from httr's normal oauth function).
#' @return A nice big blob of whatever your get request returns.
#' @export
#' @examples
#' queryResult <- queryApi(
#' query_string = 'https://api.fitbit.com/1/user/-/activities/heart/date/2017-07-31/1d/1min/time/00:00/23:59.json'
#'   token_or_conf = fitrbit::makeConfig(api_keys)
#'  )
#' @import httr
queryApi <- function(query_string, token_or_conf){

  if(class(token_or_conf) == "character"){
    result <- httr::GET(query_string, httr::add_headers( Authorization = paste("Bearer", token_or_conf) ) )
  } else {
    result <- httr::GET(query_string, config = token_or_conf)
  }

  return(result)
}
