#' Grabs the users info.
#' @param token An oauth config object setup with your token.
#' @return A list with lots of info about the user.
#' @export
#' @examples
#' getUserInfo <- function(token)
getUserInfo <- function(
  token
){

  # token <- makeConfig(api_keys,
  #   scope = c("activity", "heartrate", "sleep")
  # )

  queryString <- "https://api.fitbit.com/1/user/-/profile.json"

  rawQuery <- fitbitGet(queryString, token)

  parsedQuery <- queryParse(rawQuery)

}
