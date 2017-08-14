#' Plots a series of fitbit time series charts with a tagger.
#'
#' @param id the id you will use to keep track of this component in your app
#' @param width width of vizualization in css units of your choice. Defaults to filling container
#' @param height height of vizualization in css units of your choice. Defaults to filling container
#' displayed
#' @return A large chart conataining as many days worth of data as was fed to it along with a tag interface.
#' @export
#' @examples
#' fitbitTaggerUI('tagger')
#' @import shiny
taggingModuleUI <- function(id, width = NULL, height = 1000) {
  # Create a namespace function using the provided id
  ns <- NS(id)
  #set up output
  activityTaggerOutput(ns('tagviz'), width, height)
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
taggingModule <- function(input, output, session, data) {
  output$tagviz <- renderActivityTagger(activityTagger(data))

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
