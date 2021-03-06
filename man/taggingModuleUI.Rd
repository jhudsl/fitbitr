% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/taggingModule.R
\name{taggingModuleUI}
\alias{taggingModuleUI}
\title{Plots a series of fitbit time series charts with a tagger.}
\usage{
taggingModuleUI(id, width = NULL, height = 1000)
}
\arguments{
\item{id}{the id you will use to keep track of this component in your app}

\item{width}{width of vizualization in css units of your choice. Defaults to filling container}

\item{height}{height of vizualization in css units of your choice. Defaults to filling container
displayed}
}
\value{
A large chart conataining as many days worth of data as was fed to it along with a tag interface.
}
\description{
Plots a series of fitbit time series charts with a tagger.
}
\examples{
fitbitTaggerUI('tagger')
}
