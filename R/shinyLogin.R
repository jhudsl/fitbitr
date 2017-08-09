#' Allows the easy retreival of a token for using apis in your shiny apps.
#' @param id the id you will use to keep track of this component in your app
#' @return A button that a used presses to login to your given authentication service.
#' @export
#' @examples
#' shinydrawrUI('myrecorder')
shinyLoginUI <- function(id) {
  ns <- NS(id)

  #Grab the external javascript
  shinyLoginjs <- .get_script("shinyLogin.js", "js")

  tagList(
    singleton(
      tags$head( #load external scripts.
        tags$script(HTML(shinyLoginjs))
      )
    ),
    tags$button(id = ns("authButton"), "Login Button")
  ) #end tag list.
}


#' Server side component. You supply this with your api credentials.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @param api_info A named list of the various api values you need to authenticate. "key", "id", "secret", "url", "token_url" 'https://www.fitbit.com/oauth2/authorize'
#' @param api_key your apps personal api key.
#' @param scope a vector of what you're requesting access to in the API. See the given api docs for examples.
#' @export
#' @examples
#' authButton <- callModule(shinyauth, "fitbit_login", api_info = api_keys)
shinyLogin <- function(input, output, session,
                      api_info,
                      response_type = "code"){

  key_secret_code <- .to_base_64(paste0(api_info$key, ":", api_info$secret))

  #Send over a message to javascript telling it to initialize the login button process.
  session$sendCustomMessage(
    type = "initialize_button",
    message = list(
      dom_target = session$ns("authButton"),
      main_url = api_info$auth_url,
      api_key = api_info$key,
      scope = api_info$scope,
      response_type = response_type,
      id  = session$ns(""))
  )

  # The user's api token in string format, when we get back a result from 'input$code' grab token using httr and return
  result <- reactive({
    req(input$code) #only attempt to get a token when we actually have a code to get it with.
    token_request <- shinyGetToken(
      auth_code = input$code ,
      redirect_uri = api_info$redirect_uri,
      key = api_info$key,
      token_url = api_info$token_url,
      key_secret_code = key_secret_code
    )

    token_request$access_token
  })

  return(result)
}

