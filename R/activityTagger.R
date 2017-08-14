#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
activityTagger <- function(data, tags = c(), width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    data = data,
    tags = tags
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'activityTagger',
    x,
    width = width,
    height = height,
    package = 'fitbitr',
    elementId = elementId,
    sizingPolicy = htmlwidgets::sizingPolicy(
      viewer.padding = 0,
      viewer.paneHeight = 500,
      browser.fill = TRUE
    )
  )
}

#' Shiny bindings for activityTagger
#'
#' Output and render functions for using activityTagger within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a activityTagger
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name activityTagger-shiny
#'
#' @export
activityTaggerOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'activityTagger', width, height, package = 'fitbitr')
}

#' @rdname activityTagger-shiny
#' @export
renderActivityTagger <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, activityTaggerOutput, env, quoted = TRUE)
}
