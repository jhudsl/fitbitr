HTMLWidgets.widget({

  name: 'activityTagger',

  type: 'output',

  factory: function(el, width, height) {
    function tagsReceived(tags, colors) {
      if(HTMLWidgets.shinyMode) { // check to make sure we're in shiny.
        Shiny.onInputChange(el.id + "_tagData", JSON.stringify(tags));
      }
    }

    console.log('factory passed', el, width, height)

    var domTarget = '#' + el.id;

    var fitbitPlot = fitbit_viz({
      domTarget: domTarget,
      width: width,
      tagMessage:tagsReceived
    });

    d3.select(domTarget)
      .style('margin', '0 auto')
      .style('overflow', 'scroll')
      .style('height', height == 0 ? 1000: height);

    return {

      renderValue: function(x) {
        console.log('renderValue() passed', x)

        // convert data frame to d3 friendly format
        var data = HTMLWidgets.dataframeToD3(x.data);

        fitbitPlot.newData(data);
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
