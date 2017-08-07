#' Parses a returned query from the fitbit api into a nice R object we can work with
#' @param queryResult A blob of response from the fitbit api as delivered by \code{fitbitGet()}
#' @return An R object with the data we desire in an easier to access setup.
#' @export
#' @examples
#' query_string = parseQuery(fitbitGet(...))
#' @import httr
parseQuery <- function(queryResult){

  if(httr::status_code(queryResult) == 429){
    stop("You've hit the API rate limit!")
  }

  if(httr::status_code(queryResult) == 401){
    stop("Your token is stale, please update it.")
  }

  if(httr::status_code(queryResult) == 400){
    stop("Your query is malformed. Try using makeQueryString() to ensure correct forms or see the fitbit api docs for reference (https://dev.fitbit.com/)")
  }

  queryResult %>%
    httr::content(as="text") %>%
    jsonlite::fromJSON()
}

