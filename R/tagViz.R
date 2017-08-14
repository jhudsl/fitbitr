#' fitbit taging viz widget portion
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
tagViz <- function(data, tags = c(), width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    data = data,
    tags = tags
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'tagViz',
    x,
    width = width,
    height = height,
    package = 'fitbitr',
    sizingPolicy = htmlwidgets::sizingPolicy(
      viewer.padding = 0,
      viewer.paneHeight = 500,
      browser.fill = TRUE
    )
  )
}

#' Shiny bindings for fitbitViz
#'
#' Output and render functions for using fitbitViz within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a fitbitViz
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name fitbitViz-shiny
#'
#' @export
tagVizOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'tagViz', width, height, package = 'fitbitViewer')
}

#' @rdname fitbitViz-shiny
#' @export
renderTagViz <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, tagVizOutput, env, quoted = TRUE)
}
