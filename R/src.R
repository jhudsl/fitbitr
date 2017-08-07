# Define the pipe for other functions
`%>%` <- dplyr::`%>%`

#In order to load the javascript and css we can first load it to a character var
.get_script <- function(title, type){
  fileName <- system.file(type, title, package = "fitbitr")
  readChar(fileName, file.info(fileName)$size)
}

#convert a string to base64
.to_base_64 <- function(string) base64enc::base64encode(charToRaw(string))
