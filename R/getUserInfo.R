#' Grabs the users info and returns a giant list of things to see. For the full list of things see (https://dev.fitbit.com/docs/user/). Each key is available as the corresponding key of the R return object.
#' @param token An oauth config object setup with your token.
#' @return A list with lots of info about the user.
#' @export
#' @examples
#' getUserInfo <- function(token)
getUserInfo <- function(token){
  makeQueryString(type = 'user') %>%
    queryApi(token) %>%
    parseQuery() %>%
    .[["user"]]
}
