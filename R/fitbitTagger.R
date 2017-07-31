#' Plots a series of fitbit time series charts with a tagger.
#'
#' @param id the id you will use to keep track of this component in your app
#' @param ... additional tags to \code{\link{div}} to display before plot is
#' displayed
#' @return A large chart conataining as many days worth of data as was fed to it along with a tag interface.
#' @export
#' @examples
#' fitbitTaggerUI('tagger')
#' @import shiny
fitbitTaggerUI <- function(id) {
  # Create a namespace function using the provided id
  ns <- NS(id)
  #set up output
  fitbitVizOutput(ns('tagviz'))
}



#' Sets up an interface for users to tag their fitbit activities and returns a reactive dataframe that updates everytime they tag something.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @param data dataframe returned from the function \code{\link{getPeriodProfile()}}
#' @export
#' @examples
#' \dontrun{
#' userTags <- callModule(fitbitTagger, 'tagger', day_data = days_profile)
#' }
#' @import jsonlite shiny
fitbitTagger <- function(input, output, session, data) {
  output$tagviz <- renderFitbitViz(fitbitViz(data))
  result <- reactive({
    rawReturn <- input$tagviz_tagData
    if(is.null(rawReturn)){
      result <- rawReturn
    } else {
      result <- jsonlite::fromJSON(rawReturn)
    }
  })
  return(result)
}
