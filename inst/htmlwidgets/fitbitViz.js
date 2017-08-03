HTMLWidgets.widget({

  name: 'fitbitViz',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance
    return {

      renderValue: function(x) {
        // convert data frame to d3 friendly format
        var data = HTMLWidgets.dataframeToD3(x.data);
        var domTarget = '#' + el.id;

        function tagsReceived(tags, colors) {
          if(HTMLWidgets.shinyMode) { // check to make sure we're in shiny.
            Shiny.onInputChange(el.id + "_tagData", JSON.stringify(tags));
          }
        };

        d3.select(domTarget).style('margin', '0 auto').style('overflow', 'scroll');

        var fitbitPlot = fitbit_viz({
          data: data,
          domTarget: domTarget,
          width: width,
          tagMessage: tagsReceived
        });
      },
      resize: function(width, height) {
        // handled this inside the function already.
      }

    };
  }
});
