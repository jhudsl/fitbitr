library(shiny)
library(fitbitr)
library(tidyverse)

dayData <- read_csv(here::here('demo/fitbit_data.csv')) %>% select(-X1)
dayData1 <- dayData %>% filter(date < "2017-06-28")

ui <- fluidPage(
  title = "Tagging Demo",
  actionButton('newData', 'Try New Data'),
  taggingModuleUI('tagviz')
)

server <- function(input, output) {

  userTags <- callModule(taggingModule, 'tagviz', data = dayData1)

  observeEvent(input$newData, {
    print('clicked button, updating module')
    userTags <- callModule(taggingModule, 'tagviz', data = dayData)
  })

  observeEvent(userTags(), {
    print(userTags())
  })
}

# Run the application
shinyApp(ui = ui,
         server = server,
         options = c("port" = 1410))
