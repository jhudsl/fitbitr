#' Takes a list object with three strings: API credentials of your app's name, key, and secret. Returns a config object to be passed to other api helper functions.
#'     If it's the first time using the function a browser will open and ask you to authorize the app. After this a token should be stored so you wont need to.
#' @param api_keys An list with three values: $appname = your apps name on the api dashboard, $key = apps key (7 chars), and $secret (more than 7 chars).
#' @param scope Array of what parts of the api you want access to. Defaults to getting you "activity"(steps), "heartrate", and "sleep".
#' @return An httr configuration object that is required anytime the fitbit api is hit.
#' @export
#' @examples
#' source("api_keys.R") #Kept somewhere super duper secret
#' my_config <- makeConfig(api_keys)
makeConfig <- function(
  api_keys,
  scope = c("activity", "heartrate", "sleep", "profile")
){
  fitbit_endpoint <- httr::oauth_endpoint( authorize = "https://www.fitbit.com/oauth2/authorize",
                                           access    = "https://api.fitbit.com/oauth2/token")

  myapp <-  httr::oauth_app(appname = api_keys$appname,
                            key     = api_keys$key,
                            secret  = api_keys$secret)

  #What the heck, why do I need this?! Pull request will be sent
  Sys.setenv("HTTR_SERVER_PORT" = "1410")

  token <-  httr::oauth2.0_token( fitbit_endpoint,
                                  myapp,
                                  use_basic_auth = TRUE,
                                  scope=scope )

  config(token = token)
}
