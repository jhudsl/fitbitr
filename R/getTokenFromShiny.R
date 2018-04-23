library(shiny)
#' Spins up a small local shiny app that uses your fitbit api account to generate an oAuth token for you to use with the other portions of the package.
#' @param key Your apps main API Key. Refered to as 'OAuth 2.0 Client ID' on fitbits website.
#' @param secret Your apps secret. Longer code right below the key on the fitbit website. Called 'Client Secret'
#' @param redirect_uri The url that your app exists as. You should set this to wherever this app will get hosted. Most likely is http://localhost:5555 (port can be configued with argument \code{app_port})
#' @param auth_url Url to go to to get token. Almost always is 'https://www.fitbit.com/oauth2/authorize' so can be left at default
#' @param token_url Url to go to the (re)authorize token. Like \code{auth_url} this is almost always left at its default of 'https://api.fitbit.com/oauth2/token'
#' @param scope An array containing the data you want your app to have access to. For more details see all the options at https://dev.fitbit.com/build/reference/web-api/oauth2/#scope. 
#' @param app_port The port you want this shiny app to use. Note that this MUST MATCH the port appended to the end of your \code{redirect_uri} that is configured on the fitbit developers site. Defaults to an arbitrary 5555 to attempt to avoid collisions with other running apps. 
#' @return A shiny app that will spit out text with your fitbit token once a button is clicked. 
#' @export
#' @examples
#' # Spin up shiny app that will give you a token to copy
#' getTokenFromShiny(
#'   key = 'AIFHo8',
#'   secret = '898asdf0asdfasdff97bdaksadf',
#'   redirect_url = 'http://localhost:5555' 
#' )
getTokenFromShiny <- function(
  key,
  secret, 
  redirect_uri,
  auth_url = 'https://www.fitbit.com/oauth2/authorize',
  token_url = 'https://api.fitbit.com/oauth2/token',
  scope = c(
    'activity',
    'heartrate',
    'location',
    'sleep',
    'weight'
  ),
  app_port = 5555
){
  api_keys <- list(
    'key' = key,
    'secret' = secret,
    'redirect_uri' = redirect_uri,
    'auth_url' = auth_url,
    'token_url' = token_url,
    'scope' = scope
  )
  
  # Define UI for application that draws a histogram
  ui <- fluidPage(
    
    # Application title
    titlePanel("Get a fitbit token using OAuth"),
    shinyLoginUI('loginButton'),
    h1("Here's your token:"),
    p(
      textOutput('token')
    )
  )
  
  # Define server logic required to draw a histogram
  server <- function(input, output) {
    authButton <- callModule(shinyLogin, "loginButton", api_info = api_keys)
    
    output$token = renderText({authButton()})
  }
  
  # Run the application 
  full_app <- shinyApp(ui = ui, server = server)
  
  runApp(full_app, port = app_port)
}