#' Parses a returned query from the fitbit api into a nice R object we can work with
#' @param queryResult A blob of response from the fitbit api as delivered by \code{fitbitGet()}
#' @return An R object with the data we desire in an easier to access setup.
#' @export
#' @examples
#' query_string = queryParse(fitbitGet(...))
#' @import httr
queryParse <- function(queryResult){

  if(httr::status_code(queryResult) == 429){
    stop("You've hit the API rate limit!")
  }

  queryResult %>%
    httr::content(as="text") %>%
    jsonlite::fromJSON()
}

