const {subsetData} = require('./dataHelpers');
const {curry} = require('ramda');

const setUpBrush = require('./chartFunctions/setUpBrush');

const drawAxes = require('./drawAxes');
const writeDate = require('./writeDate');
const {makeLine, makeArea} = require('./shapeGenerators');
const drawHeartRate = require('./drawHeartRate');
const drawSteps = require('./drawSteps');
const Tagger = require('./Tagger/Tagger');
const TagViz = require('./TagViz');

/* Takes a bunch of self explanatory variables, but mostly the data as a json file and the date 
 * @param {Array} data - This is an array of objects with keys "hr", "steps", and "time".
 * @param {String} date - String of the date in MM-DD-YYYY format. 
 * @param {Object} scales - Object housing three d3 scales: x, y, and toSeconds
 * @param {Object} margins - Follows the standard d3 margin conventions. Gives padding on each side of chart. 
 * @param {Number} [height = 200] - height in pixels of the days plot
 * @param {Number} [width = 1000] - Width in pixels of days plot
 * @param {Number} [lineThickness = 1] - Plot line thickness. 
 * @param {String} [hrColor = '#8da0cb'] - Hex code for heartrate line color
 * @param {String} [stepsColor = '#66c2a5'] - Hex code for steps bar color.
 * @param {String} [fontFamily = 'avenir'] - Valid css name for a font for axes. 
*/

// Chart is meant to be setup once using SingleDay(config);
// then afterwards it gets eventually passed a set of day data in the form {date, data: []}
// Along with this a d3 selector of an svg g container already set to margin conventions is provided.
const SingleDay = curry((config, selection) => {
  const {
    height,
    width,
    margins,
    scales,
    onTag,
    onTagDelete,
    lineThickness = 1,
    hrColor = '#8da0cb',
    stepsColor = '#66c2a5',
  } = config;

  // array to hold tag the day's tag data.
  const daysTags = [];
  let tagRange = [0, 0];

  // const resize = ({width, height}) => {
  //   // update svg
  //   resizeSvg({width, height});
  //   // update scales
  //   scales.resizeScales({width, height});
  //   // update axes
  //   axes.update({scales, height});
  //   // update date
  //   dateLabel.update({width, height});
  //   // update lines
  //   drawHeartRate(makeLine(scales));
  //   drawSteps(makeArea(scales));
  //   // update tags
  //   tagViz.draw(daysTags);
  // };

  // // Kick off viz.
  // resize({width, height});

  // this will get called every time the function updates, so resize events should
  // be handled automatically. The question is if the setup functions from earlier fall
  // through or we need to figure out how to redo those as well.

  selection.each(function(selData, index) {
    const svg = d3.select(this);

    // parse data.
    const {date, data} = selData;
    const hrData = subsetData({data, type: 'heart rate'});
    const stepsData = subsetData({data, type: 'steps'});

    drawAxes({svg, scales, height, margins});
    writeDate({date, width, height, svg});
    drawHeartRate({svg, scales, hrData, hrColor, lineThickness});
    drawSteps({svg, scales, stepsData, stepsColor});

    // configure brush and append a container for the brush and call the brush function on it.
    // const tagBrush = setUpBrush({width, height, scales, );
    //


    function brushEvent() {
      try {
        const s = d3.event.selection;
        const timeRange = s.map((t) => scales.toSeconds(t));
        // set the global tag range to the value we currently have. 
        tagRange = timeRange;
      } catch (err) {
        // When the user has just clicked elsewhere.
        onClickOff();
        console.log(err);
      }
    }

    // set up brushing function.
    const tagBrush = d3
      .brushX()
      .extent([[0, 0], [width, height]])
      .on('brush end', brushEvent);

    svg.append('g').attr('class', 'tag_brush').call(tagBrush);

    // set up a tagging system for this day
    // const tagger = Tagger({
    //   svg,
    //   sel,
    //   date,
    //   width: vizWidth,
    //   height: vizHeight,
    //   scales,
    //   onTag,
    //   fontFamily,
    // });

    // // Now the tag visualization
    // const tagViz = TagViz({
    //   svg,
    //   scales,
    //   height: vizHeight,
    //   onTagDelete,
    // });

    //     /** Gets new tags and visualizes them */
    // const updateTags = ({tags, lastTag}) => {
    //   // filter tags to this day
    //   daysTags = tags.filter((tag) => tag.date === date);
    //   tagViz.draw(daysTags);
    //   tagger.changePlaceHolder(lastTag);
    // };
  });

  // return {
  //   resize,
  //   updateTags,
  // };
});

module.exports = SingleDay;
