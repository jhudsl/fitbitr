HTMLWidgets.widget({

  name: 'tagViz',

  type: 'output',

  factory: function(el, width, height) {

    console.log('running the factory instance.');

    var fitbitPlot = fitbit_viz({
      data: data,
      domTarget: domTarget,
      width: width,
      tagMessage: tagsReceived
    });

    d3.select(domTarget).style('margin', '0 auto').style('overflow', 'scroll');


    return {

      renderValue: function(x) {
        console.log('running renderValue()');
        // convert data frame to d3 friendly format
        var data = HTMLWidgets.dataframeToD3(x.data);
        var domTarget = '#' + el.id;

        function tagsReceived(tags, colors) {
          if(HTMLWidgets.shinyMode) { // check to make sure we're in shiny.
            Shiny.onInputChange(el.id + "_tagData", JSON.stringify(tags));
          }
        }

            d3.select(domTarget).style('margin', '0 auto').style('overflow', 'scroll');

            fitbitPlot.newData(data, []);

        },
            resize: function(width, height) {
            // handled this inside the function already.
            }

        };
      }
    });
