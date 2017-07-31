HTMLWidgets.widget({

  name: 'fitbitViz',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance
    console.log(el, width, height);

    return {

      renderValue: function(x) {
        // convert data frame to d3 friendly format
        var data = HTMLWidgets.dataframeToD3(x.data);
        var domTarget = '#' + el.id;

        function tagsReceived(tags, colors) {
          if(HTMLWidgets.shinyMode) { // check to make sure we're in shiny.
            console.log(tags);
            Shiny.onInputChange(el.id + "_tagData", JSON.stringify(tags));
          }
        };

        d3.select(domTarget).style('margin', '0 auto');

        var fitbitPlot = fitbit_viz({
          data: data,
          domTarget: domTarget,
          width: width,
          tagMessage: tagsReceived
        });
      },
      resize: function(width, height) {
        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
